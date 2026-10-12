import { useState, type ReactElement } from 'react';
import { author, type AuthorIcon } from './content';
import {
  DiscordIcon,
  FacebookIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
} from './BrandIcons';
import { iconButton, primaryButton } from './styles';

const iconMap: Record<AuthorIcon, (props: { className?: string }) => ReactElement> = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  mail: MailIcon,
  discord: DiscordIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
};

export default function AuthorSection() {
  const [failed, setFailed] = useState(false);

  return (
    <section id="author" aria-labelledby="author-heading" className="scroll-mt-24">
      <div className="mx-auto w-full max-w-[90rem] px-[clamp(1rem,4vw,3rem)] py-16 sm:py-20 lg:py-24">
        <div
          data-reveal
          className="mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-2xl border border-line bg-surface px-6 py-10 text-center sm:flex-row sm:gap-8 sm:px-10 sm:text-left"
        >
          <div className="shrink-0">
            {failed ? (
              <span
                aria-hidden="true"
                className="grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 text-2xl font-semibold text-cyan-100 ring-1 ring-white/10 sm:h-32 sm:w-32"
              >
                {author.initials}
              </span>
            ) : (
              <img
                src={author.avatarUrl}
                alt={`${author.name} avatar`}
                width={128}
                height={128}
                loading="lazy"
                decoding="async"
                onError={() => setFailed(true)}
                className="h-28 w-28 rounded-full object-cover ring-1 ring-white/10 sm:h-32 sm:w-32"
              />
            )}
          </div>

          <div className="flex min-w-0 flex-col items-center sm:items-start">
            <p className="text-sm font-medium text-cyan-400">Built by</p>
            <h2 id="author-heading" className="mt-1 text-xl font-semibold text-white">
              {author.name}
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-neutral-400">{author.blurb}</p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              {author.links.map((link) => {
                const Icon = iconMap[link.icon];
                return (
                  <a
                    key={link.icon}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    title={link.label}
                    className={iconButton}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>

            <a
              href={author.sourceHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`${primaryButton} mt-5`}
            >
              <GitHubIcon className="h-4 w-4" />
              {author.sourceLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
