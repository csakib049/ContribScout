import LogoMark from '../LogoMark';
import { footerLinks } from './content';

export default function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto w-full max-w-[90rem] px-[clamp(1rem,4vw,3rem)] py-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <LogoMark className="h-7 w-7 shrink-0" />
            <span className="text-sm font-semibold tracking-tight text-white">
              Contrib<span className="text-cyan-400">Scout</span>
            </span>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {footerLinks.map((link) =>
              'external' in link && link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-neutral-400 transition-colors duration-200 hover:text-white"
                >
                  {link.label}
                </a>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-neutral-400 transition-colors duration-200 hover:text-white"
                >
                  {link.label}
                </a>
              ),
            )}
          </nav>
        </div>

        <div className="mt-8 border-t border-line pt-6">
          <p className="text-xs text-neutral-400">© {year} ContribScout</p>
        </div>
      </div>
    </footer>
  );
}
