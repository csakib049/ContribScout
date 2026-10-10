import { useEffect, useRef } from 'react';
import LandingHeader from '../components/landing/LandingHeader';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import ProductPreview from '../components/landing/ProductPreview';
import AuthorSection from '../components/landing/AuthorSection';
import FinalCta from '../components/landing/FinalCta';
import LandingFooter from '../components/landing/LandingFooter';

export default function LandingPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || typeof IntersectionObserver === 'undefined') return;

    document.documentElement.classList.add('reveal-enabled');

    const elements = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove('reveal-enabled');
    };
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen">
      <LandingHeader />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <ProductPreview />
        <AuthorSection />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>
  );
}
