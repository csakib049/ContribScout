import type { ReactNode } from 'react';
import { features } from './content';

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

const icons: Record<string, ReactNode> = {
  browse: (
    <Icon>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.6-3.6" />
    </Icon>
  ),
  difficulty: (
    <Icon>
      <path d="M12 3a9 9 0 0 0-9 9" />
      <path d="M21 12a9 9 0 0 0-9-9" />
      <path d="M3 12a9 9 0 0 0 9 9" />
      <path d="M21 12a9 9 0 0 1-9 9" />
      <path d="m12 12 4-2" />
    </Icon>
  ),
  inspect: (
    <Icon>
      <path d="M14 2.5H7a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7.5z" />
      <path d="M14 2.5v5h5" />
      <path d="m10 13-2 2 2 2" />
      <path d="m14 13 2 2-2 2" />
    </Icon>
  ),
  save: (
    <Icon>
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </Icon>
  ),
};

export default function Features() {
  return (
    <section id="features" aria-labelledby="features-heading" className="scroll-mt-24">
      <div className="mx-auto w-full max-w-[90rem] px-[clamp(1rem,4vw,3rem)] py-16 sm:py-20 lg:py-24">
        <div className="max-w-2xl" data-reveal>
          <p className="text-sm font-medium text-cyan-400">Features</p>
          <h2
            id="features-heading"
            className="mt-2 text-[clamp(1.75rem,3.2vw,2.5rem)] font-semibold tracking-tight text-white"
          >
            Built to get you contributing faster
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:gap-6">
          {features.map((feature, index) => (
            <article
              key={feature.key}
              data-reveal
              style={{ transitionDelay: `${index * 60}ms` }}
              className="rounded-xl border border-line bg-surface p-6 transition-colors duration-200 hover:border-line-strong"
            >
              <div className="grid h-10 w-10 place-items-center rounded-lg border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">
                {icons[feature.key]}
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
