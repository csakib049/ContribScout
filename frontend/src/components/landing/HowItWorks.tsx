import { steps } from './content';

export default function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-heading" className="scroll-mt-24">
      <div className="mx-auto w-full max-w-[90rem] px-[clamp(1rem,4vw,3rem)] py-16 sm:py-20 lg:py-24">
        <div className="max-w-2xl" data-reveal>
          <p className="text-sm font-medium text-cyan-400">How it works</p>
          <h2
            id="how-heading"
            className="mt-2 text-[clamp(1.75rem,3.2vw,2.5rem)] font-semibold tracking-tight text-white"
          >
            Three steps to your next contribution
          </h2>
        </div>

        <div className="relative mt-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 top-5 hidden h-px bg-line md:block"
          />
          <ol className="relative grid gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((step, index) => (
              <li
                key={step.number}
                data-reveal
                style={{ transitionDelay: `${index * 80}ms` }}
                className="relative"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-500/30 bg-neutral-950 text-sm font-semibold text-cyan-300">
                  {step.number}
                </div>
                <h3 className="mt-4 text-base font-semibold text-white">{step.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-neutral-400">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
