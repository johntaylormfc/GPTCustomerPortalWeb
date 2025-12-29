import Link from 'next/link';
import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface NavigationCardProps {
  title: string;
  description: string;
  href: string;
  icon?: ReactNode;
}

export function NavigationCard({ title, description, href, icon }: NavigationCardProps) {
  return (
    <Link
      href={href}
      className={clsx(
        'group flex min-h-[140px] flex-col rounded-xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-surface-dark'
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 leading-tight">{title}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-tight">{description}</p>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium text-sky-600 group-hover:underline dark:text-sky-400">
        Open
      </span>
    </Link>
  );
}
