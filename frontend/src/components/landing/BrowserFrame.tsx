interface Props {
  src: string;
  alt: string;
  width: number;
  height: number;
  loading?: 'eager' | 'lazy';
  priority?: boolean;
  crop?: boolean;
  className?: string;
}

export default function BrowserFrame({
  src,
  alt,
  width,
  height,
  loading = 'lazy',
  priority = false,
  crop = false,
  className = '',
}: Props) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-line bg-surface shadow-2xl shadow-black/50 ${className}`}
    >
      <div className="flex items-center gap-1.5 border-b border-line bg-elevated/80 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" aria-hidden="true" />
      </div>

      <div className="relative">
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          className={crop ? 'max-h-[32rem] w-full object-cover object-top' : 'block w-full'}
        />
        {crop && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface to-transparent"
          />
        )}
      </div>
    </div>
  );
}
