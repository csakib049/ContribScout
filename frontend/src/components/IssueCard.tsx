import type { Issue } from '../types';
import { ClockIcon, MessageIcon } from './icons';
import { toEmoji } from '../utils/emoji';
import { relativeDate } from '../utils/format';
import { difficultyDots, difficultyText } from '../utils/presentation';

const MAX_LABELS = 3;

interface Props {
  issue: Issue;
}

export default function IssueCard({ issue }: Props) {
  const title = toEmoji(issue.title);
  const labels = issue.labels.map((label) => toEmoji(label));
  const visibleLabels = labels.slice(0, MAX_LABELS);
  const hiddenCount = labels.length - visibleLabels.length;
  const updated = relativeDate(issue.updated_at);
  const difficultyDot = difficultyDots[issue.difficulty_level] ?? 'bg-neutral-400';
  const difficultyColor = difficultyText[issue.difficulty_level] ?? 'text-muted';

  return (
    <a
      href={issue.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3 rounded-xl border border-line bg-surface p-4 transition-[transform,border-color,background-color] duration-150 hover:-translate-y-px hover:border-line-strong hover:bg-elevated focus-visible:border-accent/60"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <span className="shrink-0 font-mono text-xs leading-6 text-muted">#{issue.number}</span>
          <h3
            title={title}
            className="line-clamp-2 min-w-0 flex-1 text-sm font-semibold leading-6 text-primary [overflow-wrap:anywhere] group-hover:text-white"
          >
            {title}
          </h3>
        </div>

        {visibleLabels.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {visibleLabels.map((label, index) => (
              <span
                key={`${label}-${index}`}
                title={label}
                className="max-w-[12rem] truncate rounded-full border border-line bg-elevated px-2 py-0.5 text-[11px] font-medium text-secondary"
              >
                {label}
              </span>
            ))}
            {hiddenCount > 0 && (
              <span
                title={labels.slice(MAX_LABELS).join(', ')}
                className="rounded-full border border-line bg-surface px-2 py-0.5 text-[11px] font-medium text-muted"
              >
                +{hiddenCount}
              </span>
            )}
          </div>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <MessageIcon className="h-3.5 w-3.5" />
            {issue.comments}
            <span className="sr-only">comments</span>
          </span>
          {updated && (
            <span className="inline-flex items-center gap-1">
              <ClockIcon className="h-3.5 w-3.5" />
              Updated {updated}
            </span>
          )}
        </div>
      </div>

      <span
        className={`mt-1 inline-flex shrink-0 items-center gap-1.5 text-[11px] font-medium ${difficultyColor}`}
        title={`${issue.difficulty_level} difficulty`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${difficultyDot}`} aria-hidden="true" />
        {issue.difficulty_level}
      </span>
    </a>
  );
}
