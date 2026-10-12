interface Props {
  videoSrc: string;
  videoAlt: string;
}

export default function DiscoverySection({ videoSrc, videoAlt }: Props) {
  return (
    <section
      id="discovery"
      aria-labelledby="discovery-heading"
      className="scroll-mt-24"
    >
      <div className="mx-auto w-full max-w-[90rem] px-[clamp(1rem,4vw,3rem)] py-16 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[3fr_5fr] lg:gap-16">
          <div data-reveal>
            <p className="text-sm font-medium text-cyan-400">Automatic discovery</p>
            <h2
              id="discovery-heading"
              className="mt-2 text-[clamp(1.75rem,3.2vw,2.5rem)] font-semibold leading-tight tracking-tight text-white"
            >
              We find good repos for you.
            </h2>
            <p className="mt-4 text-base leading-7 text-neutral-400">
              ContribScout doesn't rely on a static list. It continuously searches GitHub, pulls in candidates, and runs each one through quality checks before it ever reaches you. A repo only shows up if it has open issues, beginner-friendly labels like{' '}
              <span className="text-cyan-400">good first issue</span> or{' '}
              <span className="text-cyan-400">help wanted</span>, recent activity, and isn't archived or a fork.
            </p>
            <p className="mt-3 text-base leading-7 text-neutral-400">
              The database — not a hand-maintained list — is the real source of truth. New repositories land on the site automatically, so you always have fresh, genuinely useful projects to contribute to.
            </p>
          </div>

          <div data-reveal>
            <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-2xl shadow-black/50">
              <iframe
                src={videoSrc}
                title={videoAlt}
                className="block w-full"
                style={{ aspectRatio: '16 / 9', minHeight: '640px' }}
                allow="autoplay"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
