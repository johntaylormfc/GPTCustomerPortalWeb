"use client";

import { Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

export function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-sky-400 dark:bg-sky-500 dark:hover:bg-sky-400"
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {pending ? 'Saving…' : 'Save details'}
    </button>
  );
}
