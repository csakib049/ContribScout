import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BrowserFrame from './BrowserFrame';
import CursorGrid from './CursorGrid';
import GradientText from './GradientText';
import { GitHubIcon } from './BrandIcons';
import { primaryButton, secondaryButton } from './styles';
import { hero, SIGN_IN_URL } from './content';
import repoDetailsShot from '../../assets/landing/repo-details.png';

export default function Hero() {
  const { user, loading } = useAuth();

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <CursorGrid
          cellSize={56}
          color="#2563eb"
          radius={180}
          falloff="smooth"
          holdTime={400}
          fadeDuration={750}
          lineWidth={1}
          maxOpacity={0.7}
          fillOpacity={0}
          gridOpacity={0.05}
          cellRadius={0}
          clickPulse
          pulseSpeed={600}
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[42rem] max-w-full -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-[90rem] px-[clamp(1rem,4vw,3rem)] pb-16 pt-16 sm:pb-20 sm:pt-24 lg:pb-24 lg:pt-28">
        <div className="grid items-center gap-12 lg:grid-cols-[5fr_6fr] lg:gap-16">
          <div>
            <span className="inline-flex items-center rounded-full border border-line bg-elevated px-3 py-1 text-xs font-medium text-secondary">
              {hero.pill}
            </span>

            <h1
              id="hero-heading"
              className="mt-5 text-[clamp(2.125rem,5.5vw,3.75rem)] font-semibold leading-[1.08] tracking-tight text-white"
            >
              <GradientText
                colors={['#2563eb', '#ffffff', '#22d3ee']}
                animationSpeed={1}
                variant="flow"
                glow={0.4}
                pauseOnHover
              >
                {hero.titleLead}
              </GradientText>{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {hero.titleHighlight}
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-neutral-400">{hero.subtitle}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {loading ? (
                <div className="h-11 w-44 animate-pulse rounded-lg bg-neutral-900" aria-hidden="true" />
              ) : user ? (
                <Link to="/explore" className={primaryButton}>
                  Go to Explore
                </Link>
              ) : (
                <>
                  <Link to="/explore" className={primaryButton}>
                    Start exploring
                  </Link>
                  <a href={SIGN_IN_URL} className={secondaryButton}>
                    <GitHubIcon className="h-4 w-4" />
                    Sign in with GitHub
                  </a>
                </>
              )}
            </div>

            {!loading && !user && (
              <p className="mt-4 text-sm text-neutral-400">{hero.helper}</p>
            )}
          </div>

          <div className="lg:pl-4">
            <BrowserFrame
              src={repoDetailsShot}
              alt="The ContribScout repository details page, showing a project's description along with its open issues and file tree."
              width={1714}
              height={910}
              loading="eager"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
