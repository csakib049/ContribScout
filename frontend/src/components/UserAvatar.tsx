import { useState } from 'react';

interface Props {
  username: string;
  className?: string;
}

export default function UserAvatar({ username, className = '' }: Props) {
  const [failed, setFailed] = useState(false);

  const base = `grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-full ring-1 ring-white/10 ${className}`;

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
