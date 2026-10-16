import { useState } from 'react';

interface Props {
  username: string;
  size?: 'small' | 'medium' | 'large';
  shape?: 'circle' | 'tile';
  className?: string;
}

export default function UserAvatar({ username, size = 'small', shape = 'circle', className = '' }: Props) {
  const [failed, setFailed] = useState(false);

  const dimensions = {
    small: 'h-7 w-7',
    medium: 'h-10 w-10',
    large: 'h-12 w-12 sm:h-14 sm:w-14',
  }[size];
  const rounding = shape === 'tile' ? 'rounded-xl' : 'rounded-full';
  const base = `grid ${dimensions} shrink-0 place-items-center overflow-hidden ${rounding} ring-1 ring-white/10 ${className}`;

  if (failed || !username) {
    return (
      <span
        className={`${base} bg-gradient-to-br from-cyan-500/30 to-blue-500/30 text-xs font-semibold text-cyan-100`}
        aria-hidden="true"
      >
        {username.charAt(0).toUpperCase() || '?'}
      </span>
    );
  }

  return (
    <img
      src={`https://github.com/${encodeURIComponent(username)}.png?size=64`}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`${base} bg-neutral-800 object-cover`}
    />
  );
}
