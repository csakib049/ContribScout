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

export interface GitTreeItem {
  path: string;
  type: 'blob' | 'tree';
  size?: number;
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

export interface GitHubSearchRepoItem {
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
  archived: boolean;
  fork: boolean;
  pushed_at: string;

}



export async function fetchRepo(owner: string, repo: string): Promise<GitHubRepo> {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, { headers: headers() });

  if (!res.ok) throw new Error(`GitHub API error fetching repo ${owner}/${repo}: ${res.status}`);

  return res.json();

}

export async function fetchIssues(owner: string, repo: string): Promise<GitHubIssue[]> {
  const allIssues: GitHubIssue[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const res = await fetch(
      `${GITHUB_API}/repos/${owner}/${repo}/issues?state=open&per_page=${perPage}&page=${page}`,
      { headers: headers() }
    );
    if (!res.ok) throw new Error(`GitHub API error fetching issues for ${owner}/${repo}: ${res.status}`);
    const data: GitHubIssue[] = await res.json();
    const realIssues = data.filter((item) => !item.pull_request);
    allIssues.push(...realIssues);

    if (data.length < perPage) break; // last page reached
    page++;
    if (page > 5) break; // safety cap — stop after 500 issues even for huge repos
  }

  return allIssues;
}


// called live, every time someone opens a repository's details page
export async function fetchFileTree(owner: string, repo: string): Promise<GitTreeItem[]> {
  const repoInfo = await fetchRepo(owner, repo);
  const branch = repoInfo.default_branch || 'main';

  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    { headers: headers() }
  );

  if (!res.ok) throw new Error(`Github API error fetching file tree for ${owner}/${repo}:${res.status}`);


  const data = await res.json()

  return data.tree;

}


export async function searchCandidateRepos(language: string): Promise<GitHubSearchRepoItem[]> {
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - 30); // repo pushed within last 30 days 
  const sinceStr = sinceDate.toISOString().split('T')[0];


  const query = `stars:>1000 pushed:>${sinceStr} language:${language} archived:false fork:false`;
  const url = `${GITHUB_API}/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=50`;


  const res = await fetch(url, { headers: headers() });
  if (!res.ok) throw new Error(`Github search error for language ${language}: ${res.status}`);


  const data = await res.json();
  return data.items;

}



export async function hasBeginnerFriendlyIssues(owner: string, repo: string): Promise<boolean> {

  const query = `repo:${owner}/${repo} is:issue is:open label:"good first issue","help wanted"`;
  const url = `${GITHUB_API}/search/issues?q=${encodeURIComponent(query)}&per_page=1`;


  const res = await fetch(url, { headers: headers() });
  if (!res.ok) throw new Error(`GitHub issue-label search error for ${owner}/${repo}: ${res.status}`);


  const data = await res.json();

  return data.total_count > 0;


}