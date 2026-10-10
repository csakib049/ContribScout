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
          className="mx-auto flex max-w-2xl flex-col items-center rounded-2xl border border-line bg-surface px-6 py-10 text-center sm:px-10"
        >
          <p className="text-sm font-medium text-cyan-400">Built by</p>

          {failed ? (
            <span
              aria-hidden="true"
              className="mt-4 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 text-xl font-semibold text-cyan-100 ring-1 ring-white/10"
            >
              {author.initials}
            </span>
          ) : (
            <img
              src={author.avatarUrl}
              alt={`${author.name} avatar`}
              width={80}
              height={80}
              loading="lazy"
              decoding="async"
              onError={() => setFailed(true)}
              className="mt-4 h-20 w-20 rounded-full object-cover ring-1 ring-white/10"
            />
          )}

          <h2 id="author-heading" className="mt-4 text-xl font-semibold text-white">
            {author.name}
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-neutral-400">{author.blurb}</p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
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
            className={`${primaryButton} mt-6`}
          >
            <GitHubIcon className="h-4 w-4" />
            {author.sourceLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
