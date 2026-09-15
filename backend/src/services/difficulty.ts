import { GitHubIssue, GitHubRepo } from "./github";

export function scoreIssue(issue: GitHubIssue): { score: number; level: string } {
    let score: number = 0;

    const labelNames = issue.labels.map((l) => (typeof l === 'string' ? l : l.name).toLowerCase());

    if (labelNames.includes('documentation')) score += 5;
    if (labelNames.includes('bug')) score += 15;
    if (labelNames.some((l) => l.includes('enhancement') || l.includes('features'))) score += 25;

    if (issue.comments > 10) score += 10;


    const level: string = score <= 15 ? 'Begineer' : score <= 40 ? 'Intermediate' : 'Advanced';

    return { score, level };

}


export function scoreRepo(repo: GitHubRepo): { score: number; level: string } {
    let score = 0;
    if (repo.size > 500000) score += 10;
    const level = score <= 15 ? 'Beginner' : score <= 40 ? 'Intermediate' : 'Advanced';

    return { score, level };
}


