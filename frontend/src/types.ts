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
    defficulty_score: number;
    difficulty_level: string;
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
}


export interface FileTreeItem {
    path: string;
    type: 'blob' | 'tree';
    size?: number;
}