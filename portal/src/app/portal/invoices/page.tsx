import { getInvoices } from '@/lib/bc';
import { getCurrentCustomerNo } from '@/lib/customer';
import type { SalesInvoice } from '@/lib/types';
import { InvoicesTable } from './table';
import { redirect } from 'next/navigation';

export default async function InvoicesPage() {
  const customerNo = getCurrentCustomerNo();
  if (!customerNo) {
    redirect('/login');
  }
  const invoices: SalesInvoice[] = customerNo ? await getInvoices(customerNo) : await getInvoices();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">Documents</p>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Sales Invoices</h1>
          {customerNo && <p className="text-sm text-slate-500 dark:text-slate-400">Customer {customerNo}</p>}
        </div>
      </div>

      <InvoicesTable invoices={invoices} />
    </div>
  );
}
