import { searchCandidateRepos, hasBeginnerFriendlyIssues, GitHubSearchRepoItem, fetchRepo } from './github';
import { pool } from '../db/pool';

const LANGUAGE = ['javascript', 'typescript', 'python', 'go', 'java'];
const MIN_OPEN_ISSUES = 5; //repos sould have minimum 5 repos


export interface ApprovedCandidate {
    fullName: string; // "owner/name", same shape syncRepo() already expects
}



const MIN_OPEN_ISSUES_TO_STAY_ACTIVE = 5;

// Re-checks repos already in the database, deactivates ones that no longer pass quality checks.
export async function reviewExistingRepos(): Promise<number> {
    const result = await pool.query(
        `SELECT id, owner, name FROM repositories WHERE is_active = TRUE`
    );

    let deactivatedCount = 0;

    for (const row of result.rows) {
        try {
            const repo = await fetchRepo(row.owner, row.name);

            // Same quality bar as new candidates: archived, too few issues, or no beginner labels = deactivate
            if (repo.archived || repo.open_issues_count < MIN_OPEN_ISSUES_TO_STAY_ACTIVE) {
                await pool.query(`UPDATE repositories SET is_active = FALSE WHERE id = $1`, [row.id]);
                deactivatedCount++;
                console.log(`Deactivated ${row.owner}/${row.name} (archived or too few open issues)`);
                continue;
            }

            const hasGoodLabels = await hasBeginnerFriendlyIssues(row.owner, row.name);
            if (!hasGoodLabels) {
                await pool.query(`UPDATE repositories SET is_active = FALSE WHERE id = $1`, [row.id]);
                deactivatedCount++;
                console.log(`Deactivated ${row.owner}/${row.name} (no beginner-friendly issues left)`);
            }

            await sleep(2500); // same Search API rate-limit pacing as the candidate check
        } catch (err) {
            console.error(`Review failed for ${row.owner}/${row.name}:`, err);
            // on error, leave it active rather than guessing — don't deactivate on a failed check
        }
    }

    return deactivatedCount;
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}



// Runs the full discovery pass: search each language, filter each candidate, return approved ones.
export async function discoverCandidates(): Promise<ApprovedCandidate[]> {
    const approved: ApprovedCandidate[] = [];


    for (const language of LANGUAGE) {
        console.log(`Searching candidates for ${language}....`);
        let candidates: GitHubSearchRepoItem[];
        try {
            candidates = await searchCandidateRepos(language);
        } catch (err) {
            console.error(`Search failed for ${language}: `, err);
            continue; //skip this language , keep going with the others 
        }


        for (const candidate of candidates) {
            if (candidate.open_issues_count < MIN_OPEN_ISSUES) continue;

            // Beginner-label check costs one extra API call per candidate — the expensive step.

            let hasGoodLabels: boolean;
            try {
                hasGoodLabels = await hasBeginnerFriendlyIssues(candidate.owner.login, candidate.name);
            } catch (err) {
                console.error(`Label check failed for ${candidate.full_name}:`, err);
                continue;
            }

            await sleep(2500);  // stay under GitHub's 30/min Search API limit (~1 call every 2s minimum)

            if (!hasGoodLabels) continue;

            approved.push({ fullName: candidate.full_name });
        }

    }


    return approved;

}