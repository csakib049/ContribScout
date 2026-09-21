const API_URL = import.meta.env.VITE_API_URL;

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { credentials: 'include' });
  if (!res.ok) throw new Error(`API error: ${res.status} on ${path}`);

  return res.json();
}

async function post<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,

  });

  if (!res.ok) throw new Error(`API error: ${res.status} on ${path}`);
  return res.json();
}


export function fetchRepositories(page = 1) {
  return get<{ page: number; limit: number; data: import('../types').Repository[] }>(
    `/api/repositories?page=${page}`
  );
}

export function fetchRepository(id: number) {
  return get<import('../types').Repository>(`/api/repositories/${id}`);
}

export function fetchRepositoryIssues(id: number) {
  return get<{ data: import('../types').Issue[] }>(`/api/repositories/${id}/issues`);
}

export function fetchRepositoryFiles(id: number) {
  return get<{ data: import('../types').FileTreeItem[] }>(`/api/repositories/${id}/files`);
}


export function fetchCurrentUser() {
  return get<{ user: { userId: number; githubId: number; username: string } }>('/auth/me');
}

export function logout() {
  return post<{ ok: boolean }>('/auth/logout');
}



export function fetchBookmarks() {
  return get<{ data: import('../types').Repository[] }>('/api/bookmarks');
}


export function addBookmark(repositoryId: number) {
  return postRaw(`/api/bookmarks/${repositoryId}`, 'POST');
}

export function removeBookmark(repositoryId: number) {
  return postRaw(`/api/bookmarks/${repositoryId}`, 'DELETE');
}

async function postRaw(path: string, method: 'POST' | 'DELETE'): Promise<{ ok: boolean }> {
  const res = await fetch(`${API_URL}${path}`, { method, credentials: 'include' });
  if (!res.ok) throw new Error(`API error: ${res.status} on ${path}`);
  return res.json();
}