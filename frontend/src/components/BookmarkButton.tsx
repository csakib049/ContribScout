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
      className={`text-lg leading-none ${bookmarked ? 'text-yellow-500' : 'text-gray-300'}`}
      title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      {bookmarked ? '★' : '☆'}
    </button>
  );
}