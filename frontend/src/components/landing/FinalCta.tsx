import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { primaryButton } from './styles';
import { finalCta } from './content';

export default function FinalCta() {
  const { user, loading } = useAuth();

  return (
    <section id="cta" aria-labelledby="cta-heading" className="scroll-mt-24">
      <div className="mx-auto w-full max-w-[90rem] px-[clamp(1rem,4vw,3rem)] py-16 sm:py-20 lg:py-24">
        <div
          data-reveal
          className="relative overflow-hidden rounded-2xl border border-line bg-surface px-6 py-14 text-center sm:px-10"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-64 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl"
          />

          <div className="relative mx-auto max-w-2xl">
            <h2
              id="cta-heading"
              className="text-[clamp(1.75rem,3.4vw,2.5rem)] font-semibold tracking-tight text-white"
            >
              {finalCta.heading}
            </h2>
            <p className="mt-3 text-base leading-7 text-neutral-400">{finalCta.subtitle}</p>

            <div className="mt-8 flex justify-center">
              {loading ? (
                <div className="h-11 w-44 animate-pulse rounded-lg bg-neutral-900" aria-hidden="true" />
              ) : user ? (
                <Link to="/explore" className={primaryButton}>
                  Go to Explore
                </Link>
              ) : (
                <Link to="/explore" className={primaryButton}>
                  Start exploring
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
