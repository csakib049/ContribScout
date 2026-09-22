import { pool } from '../db/pool';
import { env } from '../config/env';
import { fetchRepo, fetchIssues } from '../services/github';
import { scoreIssue, scoreRepo } from '../services/difficulty';

async function syncRepo(fullName: string) {
    const [owner, name] = fullName.split('/');
    if (!owner || !name) {
        console.warn(`Skipping invalid Tracked_repos entry : "${fullName}"`);
        return;
    }

    console.log(`Syncing ${fullName}.....`);

    const repo = await fetchRepo(owner, name);
    const { score: repoScore, level: repoLevel } = scoreRepo(repo);


    const repoResult = await pool.query(
        `INSERT INTO repositories
      (github_id, owner, name, description, url, language, stars, forks, open_issues, size, difficulty_score, difficulty_level, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,NOW())
     ON CONFLICT (github_id) DO UPDATE SET
       description = EXCLUDED.description,
       stars = EXCLUDED.stars,
       forks = EXCLUDED.forks,
       open_issues = EXCLUDED.open_issues,
       size = EXCLUDED.size,
       difficulty_score = EXCLUDED.difficulty_score,
       difficulty_level = EXCLUDED.difficulty_level,
       updated_at = NOW()
     RETURNING id`,
        [repo.id, repo.owner.login, repo.name, repo.description, repo.html_url,
        repo.language, repo.stargazers_count, repo.forks_count, repo.open_issues_count,
        repo.size, repoScore, repoLevel]
    );
    const repositoryId = repoResult.rows[0].id;

    const issues = await fetchIssues(owner, name);
    for (const issue of issues) {
        const { score, level } = scoreIssue(issue);
        await pool.query(
            `INSERT INTO issues
        (github_id, repository_id, number, title, url, state, labels, comments, difficulty_score, difficulty_level, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW())
       ON CONFLICT (github_id) DO UPDATE SET
         state = EXCLUDED.state,
         comments = EXCLUDED.comments,
         difficulty_score = EXCLUDED.difficulty_score,
         difficulty_level = EXCLUDED.difficulty_level,
         updated_at = NOW()`,
            [issue.id, repositoryId, issue.number, issue.title, issue.html_url, issue.state,
            issue.labels.map((l) => (typeof l === 'string' ? l : l.name)), issue.comments, score, level]
        );
    }
    console.log(`  ${issues.length} issues synced.`);
}


export async function runSync() {
    if (env.trackedRepos.length === 0) {
        console.error('TRACKED_REPOS is empty. Set it in .env, e.g. TRACKED_REPOS=facebook/react,vuejs/core');
        return;
    }
    for (const repo of env.trackedRepos) {
        try {
            await syncRepo(repo);
        } catch (err) {
            console.error(`Failed to sync ${repo}:`, err);
        }
    }

    console.log('Sycn complete.');

}

if (require.main === module) {
    runSync().finally(() => pool.end());
}


