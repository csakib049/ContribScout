import { pool } from "../db/pool";
import { discoverCandidates, reviewExistingRepos } from "../services/discovery";
import { syncRepo } from "./sync";




export async function runDiscovery() {
    console.log('Starting repository discovery...');

    // Part 1: find new candidates (existing logic, unchanged)
    const approved = await discoverCandidates();
    console.log(`Discovery found ${approved.length} approved candidates.`);

    for (const candidate of approved) {
        try {
            await syncRepo(candidate.fullName, 'discovered');
        } catch (err) {
            console.error(`Failed to sync discovered repo ${candidate.fullName}:`, err);
        }
    }

    // Part 2: review existing active repos, deactivate ones that no longer qualify
    console.log('Reviewing existing repos for deactivation...');
    const deactivated = await reviewExistingRepos();
    console.log(`Deactivated ${deactivated} repos that no longer meet quality criteria.`);

    console.log('Discovery complete.');
}



if (require.main === module) {
    runDiscovery().finally(() => pool.end()); // closes the database connection after discovery finishes
}