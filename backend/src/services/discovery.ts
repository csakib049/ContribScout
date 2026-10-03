import { searchCandidateRepos, hasBeginnerFriendlyIssues, GitHubSearchRepoItem } from './github';


const LANGUAGE = ['javascript', 'typescript', 'python', 'go', 'java'];
const MIN_OPEN_ISSUES = 5; //repos sould have minimum 5 repos


export interface ApprovedCandidate {
    fullName: string; // "owner/name", same shape syncRepo() already expects
}




// Runs the full discovery pass: search each language, filter each candidate, return approved ones.
export async function discoverCandidates(): Promise<ApprovedCandidate[]> {
    const approved: ApprovedCandidate[] = [];



    function sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }


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