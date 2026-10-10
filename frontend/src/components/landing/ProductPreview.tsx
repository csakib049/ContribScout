import BrowserFrame from './BrowserFrame';
import { preview } from './content';
import exploreShot from '../../assets/landing/explore.png';

export default function ProductPreview() {
  return (
    <section id="preview" aria-labelledby="preview-heading" className="scroll-mt-24">
      <div className="mx-auto w-full max-w-[90rem] px-[clamp(1rem,4vw,3rem)] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-2xl text-center" data-reveal>
          <h2
            id="preview-heading"
            className="text-[clamp(1.75rem,3.2vw,2.5rem)] font-semibold tracking-tight text-white"
          >
            {preview.heading}
          </h2>
          <p className="mt-3 text-base leading-7 text-neutral-400">{preview.subtitle}</p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl" data-reveal>
          <BrowserFrame
            src={exploreShot}
            alt="The ContribScout Explore page, showing a grid of GitHub repositories with search, difficulty filters, and difficulty badges on each repository."
            width={1590}
            height={917}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
