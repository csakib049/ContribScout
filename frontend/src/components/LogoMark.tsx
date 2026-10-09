interface Props {
  className?: string;
}

export default function LogoMark({ className }: Props) {
  return (
    <img
      src="/contribscout-logo-mark.png"
      alt=""
      className={`object-contain ${className ?? 'h-8 w-8'}`}
      width={32}
      height={32}
      draggable={false}
      decoding="async"
      aria-hidden="true"
    />
  );
}
