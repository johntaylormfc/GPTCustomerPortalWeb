import { DataTable } from '@/components/ui/data-table';
import { getOpenCustomerLedger } from '@/lib/bc';
import { getCurrentCustomerNo } from '@/lib/customer';
import { formatAmount, formatDate } from '@/lib/format';
import type { CustomerLedgerEntry } from '@/lib/types';
import { redirect } from 'next/navigation';

export default async function TransactionsPage() {
  const customerNo = getCurrentCustomerNo();
  if (!customerNo) {
    redirect('/login');
  }
  const entries: CustomerLedgerEntry[] = customerNo
    ? await getOpenCustomerLedger(customerNo)
    : await getOpenCustomerLedger();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">Financials</p>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Open Transactions</h1>
      </div>

      <DataTable<CustomerLedgerEntry>
        data={entries}
        searchKey="documentNo"
        columns={[
          { key: 'documentNo', header: 'Document No.', sortable: true },
          { key: 'documentType', header: 'Type', sortable: true },
          {
            key: 'postingDate',
            header: 'Posting Date',
            sortable: true,
            render: (row) => formatDate(row.postingDate),
          },
          {
            key: 'dueDate',
            header: 'Due Date',
            sortable: true,
            render: (row) => formatDate(row.dueDate),
          },
          {
            key: 'amount',
            header: 'Amount',
            sortable: true,
            render: (row) => formatAmount(row.amount, row.currencyCode),
          },
          {
            key: 'remainingAmount',
            header: 'Remaining',
            sortable: true,
            render: (row) => formatAmount(row.remainingAmount, row.currencyCode),
          },
        ]}
        emptyState="No open entries"
      />
    </div>
  );
}
