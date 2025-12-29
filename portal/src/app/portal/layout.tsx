import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { getCompanyInfo } from '@/lib/bc';

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const company = await getCompanyInfo();
  const initials = company?.name
    ?.split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const logoSrc = company?.logoBase64 ? `data:image/png;base64,${company.logoBase64}` : null;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-base-dark/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            {logoSrc ? (
              <div className="h-12 w-12 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700">
                <img src={logoSrc} alt={company?.name ?? 'Company logo'} className="h-full w-full object-contain" />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-600 text-sm font-semibold text-white">
                {initials || 'BC'}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">{company?.name || 'Customer Portal'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Business Central</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-4 text-sm font-medium text-slate-700 dark:text-slate-200 md:flex">
              <Link href="/portal">Dashboard</Link>
              <Link href="/portal/invoices">Invoices</Link>
              <Link href="/portal/credits">Credit Memos</Link>
              <Link href="/portal/orders">Orders</Link>
              <Link href="/portal/works-orders">Works Orders</Link>
              <Link href="/portal/returns">Returns</Link>
              <Link href="/portal/transactions">Transactions</Link>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
