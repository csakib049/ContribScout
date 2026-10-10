import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LogoMark from '../LogoMark';
import { GitHubIcon } from './BrandIcons';
import { navLink, primaryButton } from './styles';
import { SIGN_IN_URL, navLinks, GITHUB_REPO_URL } from './content';

export default function LandingHeader() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-neutral-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[90rem] items-center px-[clamp(1rem,4vw,3rem)]">
        <a href="#top" className="mr-6 flex items-center gap-2.5 rounded-md" aria-label="ContribScout home">
          <LogoMark className="h-8 w-8 shrink-0" />
          <span className="text-[15px] font-semibold leading-none tracking-tight text-white">
            Contrib<span className="text-cyan-400">Scout</span>
          </span>
        </a>

        <nav aria-label="Landing" className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className={navLink}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ContribScout on GitHub"
            title="ContribScout on GitHub"
            className="hidden h-10 w-10 items-center justify-center rounded-lg text-neutral-400 transition-colors duration-200 hover:bg-elevated hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-400/70 md:inline-flex"
          >
            <GitHubIcon className="h-5 w-5" />
          </a>

          {loading ? (
            <div className="h-10 w-40 animate-pulse rounded-lg bg-neutral-900" aria-hidden="true" />
          ) : user ? (
            <Link to="/explore" className={primaryButton}>
              Go to Explore
            </Link>
          ) : (
            <a href={SIGN_IN_URL} className={primaryButton}>
              <GitHubIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Sign in with GitHub</span>
              <span className="sm:hidden">Sign in</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
