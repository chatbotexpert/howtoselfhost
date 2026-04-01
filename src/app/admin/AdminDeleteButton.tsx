'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

interface AdminDeleteButtonProps {
  postId: string;
  postTitle: string;
}

export default function AdminDeleteButton({ postId, postTitle }: AdminDeleteButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${postTitle}"? This cannot be undone.`)) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to delete post. Please try again.');
      }
    } catch {
      alert('Something went wrong.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      title="Delete post"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
