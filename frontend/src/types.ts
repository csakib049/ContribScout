export interface Repository {
    id: number;
    owner: string;
    name: string;
    description: string | null;
    url: string;
    language: string | null;
    stars: number;
    forks: number;
    open_issues: number;
    difficulty_score: number;
    difficulty_level: string;
    is_active: boolean;
}


export interface Issue {
    id: number;
    number: number;
    title: string;
    url: string;
    state: string;
    labels: string[];
    comments: number;
    difficulty_score: number;
    difficulty_level: string;
    updated_at?: string;
}


export interface FileTreeItem {
    path: string;
    type: 'blob' | 'tree';
    size?: number;
}