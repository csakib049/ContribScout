import { Link } from 'react-router-dom';
import type { Repository } from '../types';
import BookmarkButton from './BookmarkButton';
import { ArrowRightIcon, ForkIcon, StarIcon } from './icons';
import { difficultyDots, difficultyStyles, languageColor as getLanguageColor } from '../utils/presentation';

interface Props {
  repo: Repository;
  bookmarked: boolean;
}

export default function RepoCard({ repo, bookmarked }: Props) {
  const level = repo.difficulty_level;
  const languageColor = getLanguageColor(repo.language);

  return (
    <Link
      to={`/repo/${repo.id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-500/40 hover:bg-neutral-900 hover:shadow-xl hover:shadow-black/50"
    >
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-3">
        <h2 className="min-h-11 min-w-0 break-words text-[15px] font-semibold leading-snug tracking-tight text-white">
          <span className="font-normal text-neutral-400 transition-colors group-hover:text-neutral-300">
            {repo.owner}/
          </span>
          {repo.name}
        </h2>

        <div className="flex shrink-0 items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${
              difficultyStyles[level] ?? 'border-neutral-700 bg-neutral-800 text-neutral-300'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${difficultyDots[level] ?? 'bg-neutral-400'}`}
              aria-hidden="true"
            />
            {level}
          </span>
          <BookmarkButton repositoryId={repo.id} initiallyBookmarked={bookmarked} />
        </div>
      </div>

      <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-neutral-400">
        {repo.description ?? <span className="italic text-neutral-600">No description provided.</span>}
      </p>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-neutral-800/70 pt-3.5">
        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-xs text-neutral-500 transition-colors group-hover:text-neutral-400">
          <span className="inline-flex items-center gap-1.5">
            <StarIcon className="h-3.5 w-3.5 text-amber-400/80" />
            <span>{repo.stars.toLocaleString('en-US')}</span>
            <span className="sr-only"> stars</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ForkIcon className="h-3.5 w-3.5" />
            <span>{repo.forks.toLocaleString('en-US')}</span>
            <span className="sr-only"> forks</span>
          </span>
          {repo.language && (
            <span className="inline-flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${languageColor}`} aria-hidden="true" />
              {repo.language}
            </span>
          )}
        </div>

        <span className="inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium text-neutral-500 transition-colors group-hover:bg-cyan-500/10 group-hover:text-cyan-300">
          View
          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
