import { describe, it, expect } from 'vitest';
import { scoreIssue, scoreRepo } from './difficulty';
import type { GitHubIssue, GitHubRepo } from './github';


//small helper so each test doesn't have to write out every field Github return
function makeIssue(overrides: Partial<GitHubIssue>): GitHubIssue {
    return {
        id: 1,
        number: 1,
        title: 'Test issue',
        html_url: 'https://github.com/test/test/issues/1',
        state: 'open',
        labels: [],
        comments: 0,
        ...overrides, //<-- dump everything from 'overrides' here 
    };
};



function makeRepo(overrides: Partial<GitHubRepo>): GitHubRepo {
    return {
        id: 1,
        full_name: 'test/test',
        owner: { login: 'test' },
        name: 'test',
        description: null,
        html_url: 'https://github.com/test/test',
        language: null,
        stargazers_count: 0,
        forks_count: 0,
        open_issues_count: 0,
        size: 0,
        default_branch: 'main',
        ...overrides, //<-- dump everything from 'overrides' here 
    };
}

//--------------------------------------------------------------------------------------

//scoreIssue
describe('scoreIssue', () => {

    it('scores an issue with no labels as begineer', () => {
        const result = scoreIssue(makeIssue({ labels: [] }));
        expect(result.score).toBe(0);
        expect(result.level).toBe('Beginner');
    });

    it('adds 15 points for a bug label', () => {
        const result = scoreIssue(makeIssue({ labels: ['bug'] }));
        expect(result.score).toBe(15);
        expect(result.level).toBe('Beginner'); // 15 is still <= 15
    });

    it('adds 5 points for a documentation label', () => {
        const result = scoreIssue(makeIssue({ labels: ['documentation'] }));
        expect(result.score).toBe(5);
    });

    it('adds 25 points for an enhancement label', () => {
        const result = scoreIssue(makeIssue({ labels: ['enhancement'] }));
        expect(result.score).toBe(25);
        expect(result.level).toBe('Intermediate');
    });

    it('adds 10 points when comments exceed 10', () => {
        const result = scoreIssue(makeIssue({ labels: [], comments: 15 }));
        expect(result.score).toBe(10);
    });

    it('combines bug + enhancement to reach Advanced', () => {
        const result = scoreIssue(makeIssue({ labels: ['bug', 'enhancement'], comments: 15 }));
        expect(result.score).toBe(50); // 15 + 25 + 10
        expect(result.level).toBe('Advanced');
    });

    it('label matching is case-insensitive', () => {
        const result = scoreIssue(makeIssue({ labels: ['BUG'] }));
        expect(result.score).toBe(15);
    });


});




//scoreRepo
describe("scoreRepo", () => {
    it('scores a small, quiet repo as Beginner', () => {
        const result = scoreRepo(makeRepo({ size: 100, open_issues_count: 5, stargazers_count: 100 }));
        expect(result.score).toBe(0);
        expect(result.level).toBe('Beginner');
    });

    it('adds 10 points for a large repo size', () => {
        const result = scoreRepo(makeRepo({ size: 600000 }));
        expect(result.score).toBe(10);
    });

    it('scores a big, popular, busy repo as Advanced', () => {
        const result = scoreRepo(
            makeRepo({ size: 600000, open_issues_count: 600, stargazers_count: 25000 })
        );
        expect(result.score).toBe(30);
        expect(result.level).toBe('Advanced');
    });

});


