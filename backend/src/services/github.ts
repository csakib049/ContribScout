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
  size: number
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