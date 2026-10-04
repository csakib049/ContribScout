import { GitHubIssue, GitHubRepo } from "./github";

export function scoreIssue(issue: GitHubIssue): { score: number; level: string } {
    let score: number = 0;

    const labelNames = issue.labels.map((l) => (typeof l === 'string' ? l : l.name).toLowerCase());

    if (labelNames.includes('documentation')) score += 5;
    if (labelNames.includes('bug')) score += 15;
    if (labelNames.some((l) => l.includes('enhancement') || l.includes('feature'))) score += 25;

    if (issue.comments > 10) score += 10;


    if (labelNames.some((l) => l.includes('breaking') || l.includes('major'))) score += 20;
    if (labelNames.some((l) => l.includes('question') || l.includes('discussion'))) score += 5;
    if (issue.comments > 25) score += 10;
    if (labelNames.length === 0) score += 5;


    const ageDays = (Date.now() - new Date(issue.created_at).getTime()) / (1000 * 60 * 60 * 24);
    if (ageDays > 365) score += 15;     // open a year+ — probably genuinely hard or low priority
    else if (ageDays > 180) score += 10;   // open 6+ months — likely nontrivial 


    const bodyLength = issue.body?.length ?? 0;
    if (bodyLength > 1000) score += 10;

    const level: string = score <= 15 ? 'Beginner' : score <= 40 ? 'Intermediate' : 'Advanced';
    return { score, level };

}


export function scoreRepo(repo: GitHubRepo): { score: number; level: string } {
    let score = 0;
    if (repo.size > 500000) score += 10;
    if (repo.open_issues_count > 500) score += 10;
    if (repo.stargazers_count > 20000) score += 10;
    const level = score <= 10 ? 'Beginner' : score <= 20 ? 'Intermediate' : 'Advanced';

    return { score, level };
}


