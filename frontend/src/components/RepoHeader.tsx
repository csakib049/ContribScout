import { Link } from 'react-router-dom';
import type { Repository } from '../types';
import { ExternalLinkIcon, ForkIcon, StarIcon } from './icons';
import { compactNumber, fullNumber } from '../utils/format';
import { toEmoji } from '../utils/emoji';
import { difficultyDots, languageColor } from '../utils/presentation';

interface Props {
  repo: Repository;
}

export default function RepoHeader({ repo }: Props) {
  const description = toEmoji(repo.description);
  const langColor = languageColor(repo.language);
  const difficultyDot = difficultyDots[repo.difficulty_level] ?? 'bg-neutral-400';

  return (
    <header className="relative overflow-hidden rounded-2xl border border-line bg-surface px-5 py-5 sm:px-7 sm:py-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 right-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl"
      />

      <div className="relative">
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-xs text-muted">
          <Link to="/" className="rounded transition-colors hover:text-secondary">
            Explore
          </Link>
          <span aria-hidden="true" className="text-line-strong">
            /
          </span>
          <span className="truncate">{repo.owner}</span>
          <span aria-hidden="true" className="text-line-strong">
            /
          </span>
          <span className="truncate font-medium text-secondary">{repo.name}</span>
        </nav>

        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-[26px] font-semibold leading-tight tracking-tight sm:text-[30px]">
              <span className="font-normal text-muted">{repo.owner}/</span>
              <span className="text-primary">{repo.name}</span>
            </h1>
            {description ? (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-secondary [overflow-wrap:anywhere]">
                {description}
              </p>
            ) : (
              <p className="mt-2 text-sm italic text-muted">No description provided.</p>
            )}
          </div>

          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-neutral-950 transition-colors duration-150 hover:bg-neutral-200 active:bg-neutral-300"
          >
            <ExternalLinkIcon className="h-4 w-4" />
            View on GitHub
          </a>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span
            title={`${fullNumber(repo.stars)} stars`}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-elevated px-2.5 py-1 text-xs text-secondary"
          >
            <StarIcon className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-medium text-primary">{compactNumber(repo.stars)}</span>
            <span className="sr-only">stars</span>
          </span>

          <span
            title={`${fullNumber(repo.forks)} forks`}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-elevated px-2.5 py-1 text-xs text-secondary"
          >
            <ForkIcon className="h-3.5 w-3.5" />
            <span className="font-medium text-primary">{compactNumber(repo.forks)}</span>
            <span className="sr-only">forks</span>
          </span>

          {repo.language && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-elevated px-2.5 py-1 text-xs text-secondary">
              <span className={`h-2 w-2 rounded-full ${langColor}`} aria-hidden="true" />
              <span className="font-medium text-primary">{repo.language}</span>
            </span>
          )}

          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-elevated px-2.5 py-1 text-xs text-secondary">
            <span className={`h-1.5 w-1.5 rounded-full ${difficultyDot}`} aria-hidden="true" />
            <span className="font-medium text-primary">{repo.difficulty_level}</span>
            <span className="sr-only">difficulty</span>
          </span>
        </div>
      </div>
    </header>
  );
}
