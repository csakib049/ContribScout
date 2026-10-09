import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { FileTreeItem, Issue, Repository } from "../types";
import { fetchRepository, fetchRepositoryFiles, fetchRepositoryIssues } from "../services/api";
import PageContainer from "../components/PageContainer";
import RepoHeader from "../components/RepoHeader";
import IssueCard from "../components/IssueCard";
import FileTree from "../components/FileTree";
import { AlertIcon, InboxIcon, SearchIcon, XIcon } from "../components/icons";

type MobileTab = 'issues' | 'files';

export default function RepositoryDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [reloadKey, setReloadKey] = useState(0);

  return (
    <RepoDetails
      key={`${id ?? ''}-${reloadKey}`}
      repoId={id ?? ''}
      onRetry={() => setReloadKey((key) => key + 1)}
    />
  );
}

function RepoDetails({ repoId, onRetry }: { repoId: string; onRetry: () => void }) {
  const [repo, setRepo] = useState<Repository | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [files, setFiles] = useState<FileTreeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [issuesError, setIssuesError] = useState<string | null>(null);
  const [filesError, setFilesError] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>('issues');
  const [issueQuery, setIssueQuery] = useState('');

  useEffect(() => {
    if (!repoId) return;
    const repoIdNumber = Number(repoId);
    let cancelled = false;

    Promise.allSettled([
      fetchRepository(repoIdNumber),
      fetchRepositoryIssues(repoIdNumber),
      fetchRepositoryFiles(repoIdNumber),
    ]).then(([repoResult, issuesResult, filesResult]) => {
      if (cancelled) return;

      if (repoResult.status === 'fulfilled') {
        setRepo(repoResult.value);
      } else {
        setError(
          repoResult.reason instanceof Error ? repoResult.reason.message : 'Could not load repository.',
        );
      }

      if (issuesResult.status === 'fulfilled') {
        setIssues(issuesResult.value.data);
      } else {
        setIssuesError('Could not load issues right now.');
      }

      if (filesResult.status === 'fulfilled') {
        setFiles(filesResult.value.data);
      } else {
        setFilesError('Could not load the file tree from GitHub.');
      }

      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [repoId]);

  const filteredIssues = useMemo(() => {
    const query = issueQuery.trim().toLowerCase();
    if (!query) return issues;
    return issues.filter(
      (issue) =>
        issue.title.toLowerCase().includes(query) ||
        issue.labels.some((label) => label.toLowerCase().includes(query)),
    );
  }, [issues, issueQuery]);

  if (loading) return <RepoDetailsSkeleton />;

  if (error || !repo) {
    return (
      <PageContainer className="pt-6 pb-12 sm:pt-8">
        <div className="flex flex-col items-center rounded-2xl border border-line bg-surface px-6 py-16 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-xl border border-danger/20 bg-danger/10 text-danger">
            <AlertIcon className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-base font-semibold text-primary">Something went wrong</h1>
          <p className="mt-1.5 max-w-sm text-sm text-muted">
            {error ?? 'We could not load this repository.'}
          </p>
          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={onRetry}
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-950 transition-colors hover:bg-neutral-200 active:bg-neutral-300"
            >
              Retry
            </button>
            <Link to="/" className="text-sm text-accent transition-colors hover:text-cyan-300">
              Back to Explore
            </Link>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="pt-6 pb-12 sm:pt-8">
      <RepoHeader repo={repo} />

      <div className="mt-5 lg:hidden">
        <div
          role="tablist"
          aria-label="Repository sections"
          className="inline-flex w-full gap-1 rounded-xl border border-line bg-surface p-1 sm:w-auto"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === 'issues'}
            onClick={() => setMobileTab('issues')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors sm:flex-none ${
              mobileTab === 'issues'
                ? 'bg-cyan-500/15 text-cyan-200'
                : 'text-muted hover:bg-elevated/60 hover:text-secondary'
            }`}
          >
            Issues
            <span className="text-xs opacity-80">{issues.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === 'files'}
            onClick={() => setMobileTab('files')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors sm:flex-none ${
              mobileTab === 'files'
                ? 'bg-cyan-500/15 text-cyan-200'
                : 'text-muted hover:bg-elevated/60 hover:text-secondary'
            }`}
          >
            Files
            <span className="text-xs opacity-80">{files.length}</span>
          </button>
        </div>
      </div>

      <div className="mt-5 grid items-start gap-6 lg:mt-6 lg:grid-cols-[minmax(0,1fr)_400px]">
        <section
          aria-labelledby="issues-heading"
          className={mobileTab === 'issues' ? '' : 'hidden lg:block'}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="issues-heading" className="flex items-center gap-2 text-lg font-semibold text-primary">
              Open Issues
              <span className="rounded-full border border-line bg-elevated px-2 py-0.5 text-xs font-medium text-muted">
                {issues.length}
              </span>
            </h2>
          </div>

          {!issuesError && issues.length > 0 && (
            <div className="relative mt-4">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={issueQuery}
                onChange={(event) => setIssueQuery(event.target.value)}
                placeholder="Filter issues by title or label..."
                aria-label="Filter issues"
                autoComplete="off"
                spellCheck={false}
                className="h-10 w-full rounded-lg border border-line bg-surface pl-9 pr-9 text-sm text-primary transition-colors placeholder:text-muted hover:border-line-strong focus:border-accent/60"
              />
              {issueQuery.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIssueQuery('')}
                  aria-label="Clear issue filter"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted transition-colors hover:bg-elevated hover:text-primary"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          <div className="mt-4 space-y-3">
            {issuesError ? (
              <InlineError message={issuesError} onRetry={onRetry} />
            ) : issues.length === 0 ? (
              <EmptyState
                title="No open issues"
                description="There are no synced open issues for this repository right now."
              />
            ) : filteredIssues.length === 0 ? (
              <EmptyState
                title="No matching issues"
                description={`Nothing matches "${issueQuery.trim()}". Try a different search.`}
              />
            ) : (
              filteredIssues.map((issue) => <IssueCard key={issue.id} issue={issue} />)
            )}
          </div>
        </section>

        <aside
          className={`lg:sticky lg:top-20 ${mobileTab === 'files' ? '' : 'hidden lg:block'}`}
        >
          {filesError ? (
            <InlineError message={filesError} onRetry={onRetry} />
          ) : (
            <FileTree files={files} repoUrl={repo.url} />
          )}
        </aside>
      </div>
    </PageContainer>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-line bg-surface/60 px-6 py-12 text-center">
      <div className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-elevated text-muted">
        <InboxIcon className="h-5 w-5" />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-primary">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-muted">{description}</p>
    </div>
  );
}

function InlineError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-line bg-surface px-6 py-10 text-center">
      <div className="grid h-10 w-10 place-items-center rounded-xl border border-danger/20 bg-danger/10 text-danger">
        <AlertIcon className="h-5 w-5" />
      </div>
      <p className="mt-3 max-w-xs text-sm text-muted">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-lg border border-line bg-elevated px-3.5 py-1.5 text-sm text-secondary transition-colors hover:border-line-strong hover:text-primary"
      >
        Retry
      </button>
    </div>
  );
}

function RepoDetailsSkeleton() {
  return (
    <PageContainer className="pt-6 pb-12 sm:pt-8">
      <span className="sr-only" role="status">
        Loading repository...
      </span>
      <div aria-hidden="true">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <div className="skeleton h-3 w-40 rounded" />
          <div className="skeleton mt-4 h-7 w-72 max-w-full rounded" />
          <div className="skeleton mt-3 h-4 w-full max-w-xl rounded" />
          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="skeleton h-7 w-20 rounded-full" />
            ))}
          </div>
        </div>
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="skeleton h-24 rounded-xl" />
            ))}
          </div>
          <div className="skeleton hidden h-96 rounded-2xl lg:block" />
        </div>
      </div>
    </PageContainer>
  );
}
