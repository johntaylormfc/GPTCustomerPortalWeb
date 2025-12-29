import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  tone?: 'default' | 'success' | 'warning';
  hint?: string;
}

const toneClasses: Record<NonNullable<SummaryCardProps['tone']>, string> = {
  default: 'bg-white text-slate-900 dark:bg-surface-dark dark:text-gray-100',
  success: 'bg-emerald-50 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-100',
  warning: 'bg-amber-50 text-amber-900 dark:bg-amber-900/30 dark:text-amber-100',
};

export function SummaryCard({ title, value, icon, tone = 'default', hint }: SummaryCardProps) {
  return (
    <div
      className={clsx(
        'flex items-center justify-between rounded-xl border p-4 shadow-sm backdrop-blur',
        toneClasses[tone]
      )}
      title={hint}
    >
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
      </div>
      {icon && <div className="text-slate-400 dark:text-slate-300">{icon}</div>}
    </div>
  );
}
