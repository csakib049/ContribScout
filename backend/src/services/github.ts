import { env } from '../config/env';

const GITHUB_API = 'https://api.github.com';


function headers() {
  return {
    Authorization: `Bearer ${env.githubToken}`,
    Accept: 'application/vnd.github+json',
  };
}



export interface GitHubRepo {
  id: number;
  full_name: string;
  owner: { login: string };
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  size: number;
  default_branch: string;
}

export interface GitTreeItem{
  path:string;
  type: 'blob' | 'tree';
  size?:number;
}


export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  html_url: string;
  state: string;
  labels: Array<{ name: string } | string>;
  comments: number;
  pull_request?: unknown;
}



export async function fetchRepo(owner: string, repo: string): Promise<GitHubRepo> {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, { headers: headers() });

  if (!res.ok) throw new Error(`GitHub API error fetching repo ${owner}/${repo}: ${res.status}`);

  return res.json();

}


export async function fetchIssues(owner: string, repo: string) {
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/issues?state=open&per_page=50`,
    { headers: headers() }
  );


  if(!res.ok) throw new Error(`Github Api error fetching issues for ${owner}/${repo}: ${res.status}`);

  const data:GitHubIssue[] = await res.json();

   return data.filter((item)=>!item.pull_request);
}



export async function fetchFileTree(owner:string,repo:string):Promise<GitTreeItem[]> {
  const repoInfo = await fetchRepo(owner,repo);
  const branch = repoInfo.default_branch || 'main';

  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    { headers: headers() }
  );

  if(!res.ok) throw new Error(`Github API error fetching file tree for ${owner}/${repo}:${res.status}`);

  
  const data = await res.json()

  return data.tree;
  
}