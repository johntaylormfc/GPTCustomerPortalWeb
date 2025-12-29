import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-4xl flex-col items-start justify-center gap-6 px-6">
      <div className="space-y-3">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-900 dark:text-slate-300">
          Business Central Customer Portal
        </span>
        <h1 className="text-4xl font-semibold leading-tight text-slate-900 dark:text-gray-50">
          Give your customers a focused, secure view of their account.
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Log in to view invoices, shipments, and balances directly from Dynamics 365 Business Central.
        </p>
      </div>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/login">Launch Portal</Link>
        </Button>
      </div>
    </main>
  );
}
