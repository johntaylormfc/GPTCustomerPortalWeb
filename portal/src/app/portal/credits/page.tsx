import { redirect } from 'next/navigation';
import { getCreditMemos } from '@/lib/bc';
import { getCurrentCustomerNo } from '@/lib/customer';
import type { SalesCreditMemo } from '@/lib/types';
import { CreditsTable } from './table';

export default async function CreditsPage() {
  const customerNo = getCurrentCustomerNo();
  if (!customerNo) {
    redirect('/login');
  }

  const credits: SalesCreditMemo[] = customerNo
    ? await getCreditMemos(customerNo)
    : await getCreditMemos();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">Documents</p>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Sales Credit Memos</h1>
          {customerNo && <p className="text-sm text-slate-500 dark:text-slate-400">Customer {customerNo}</p>}
        </div>
      </div>

      <CreditsTable credits={credits} />
    </div>
  );
}
