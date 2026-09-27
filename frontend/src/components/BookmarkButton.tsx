import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { addBookmark, removeBookmark } from '../services/api';

interface Props {
  repositoryId: number;
  initiallyBookmarked: boolean;
}

export default function BookmarkButton({ repositoryId, initiallyBookmarked }: Props) {
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(initiallyBookmarked);
  const [busy, setBusy] = useState(false);

  if (!user) return null; // hide entirely for logged-out users

  async function toggle(e: React.MouseEvent) {
    e.preventDefault(); // stop the click from navigating if button is inside a <Link>
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    try {
      if (bookmarked) {
        await removeBookmark(repositoryId);
        setBookmarked(false);
      } else {
        await addBookmark(repositoryId);
        setBookmarked(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`leading-none transition-colors disabled:opacity-50 ${bookmarked ? 'text-yellow-400' : 'text-neutral-500 hover:text-yellow-400'
        }`}
      title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
      aria-pressed={bookmarked}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-5 h-5 block"
        fill={bookmarked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}