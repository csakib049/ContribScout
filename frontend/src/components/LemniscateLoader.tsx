import { useEffect, useRef } from 'react';

const CONFIG = {
  particleCount: 70,
  trailSpan: 0.38,
  durationMs: 4400,
  pulseDurationMs: 5000,
  strokeWidth: 4.8,
  base: 20,
  boost: 7,
  pathSteps: 360,
} as const;

function normalizeProgress(progress: number) {
  return ((progress % 1) + 1) % 1;
}

function getDetailScale(time: number) {
  const pulseProgress = (time % CONFIG.pulseDurationMs) / CONFIG.pulseDurationMs;
  const pulseAngle = pulseProgress * Math.PI * 2;
  return 0.52 + ((Math.sin(pulseAngle + 0.55) + 1) / 2) * 0.48;
}

function getPoint(progress: number, detailScale: number) {
  const t = progress * Math.PI * 2;
  const scale = CONFIG.base + detailScale * CONFIG.boost;
  const denominator = 1 + Math.sin(t) ** 2;
  return {
    x: 50 + (scale * Math.cos(t)) / denominator,
    y: 50 + (scale * Math.sin(t) * Math.cos(t)) / denominator,
  };
}

function buildPath(detailScale: number) {
  let d = '';
  for (let index = 0; index <= CONFIG.pathSteps; index += 1) {
    const point = getPoint(index / CONFIG.pathSteps, detailScale);
    d += `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)} `;
  }
  return d;
}

interface Props {
  label?: string;
  className?: string;
}

export default function LemniscateLoader({
  label = 'Loading…',
  className = 'h-28 w-28',
}: Props) {
  const pathRef = useRef<SVGPathElement>(null);
  const particlesRef = useRef<Array<SVGCircleElement | null>>([]);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const draw = (time: number, frozen: boolean) => {
      const detailScale = frozen ? 1 : getDetailScale(time);
      path.setAttribute('d', buildPath(detailScale));

      const progress = frozen ? 0.5 : (time % CONFIG.durationMs) / CONFIG.durationMs;
      const particles = particlesRef.current;
      const lastIndex = particles.length - 1;

      particles.forEach((node, index) => {
        if (!node) return;
        const tailOffset = lastIndex === 0 ? 0 : index / lastIndex;
        const point = getPoint(
          normalizeProgress(progress - tailOffset * CONFIG.trailSpan),
          detailScale,
        );
        const fade = Math.pow(1 - tailOffset, 0.56);
        node.setAttribute('cx', point.x.toFixed(2));
        node.setAttribute('cy', point.y.toFixed(2));
        node.setAttribute('r', (0.9 + fade * 2.7).toFixed(2));
        node.setAttribute('opacity', (0.04 + fade * 0.96).toFixed(3));
      });
    };

    if (reducedMotion) {
      draw(0, true);
      return;
    }

    const startedAt = performance.now();
    let frameId = requestAnimationFrame(function render(now) {
      draw(now - startedAt, false);
      frameId = requestAnimationFrame(render);
    });

    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <span role="status" className="inline-flex text-cyan-400">
      <svg
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
        className={className}
        style={{ overflow: 'visible' }}
      >
        <g>
          <path
            ref={pathRef}
            stroke="currentColor"
            strokeWidth={CONFIG.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.1}
          />
          {Array.from({ length: CONFIG.particleCount }).map((_, index) => (
            <circle
              key={index}
              fill="currentColor"
              ref={(node) => {
                particlesRef.current[index] = node;
              }}
            />
          ))}
        </g>
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}
