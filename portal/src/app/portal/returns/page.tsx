import { DataTable } from '@/components/ui/data-table';
import { getReturnOrders } from '@/lib/bc';
import { getCurrentCustomerNo } from '@/lib/customer';
import { formatAmount, formatDate } from '@/lib/format';
import type { SalesReturnOrder } from '@/lib/types';
import { redirect } from 'next/navigation';

export default async function ReturnsPage() {
  const customerNo = getCurrentCustomerNo();
  if (!customerNo) {
    redirect('/login');
  }
  const returns: SalesReturnOrder[] = customerNo ? await getReturnOrders(customerNo) : await getReturnOrders();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">Documents</p>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Return Orders</h1>
      </div>

      <DataTable<SalesReturnOrder>
        data={returns}
        searchKey="no"
        columns={[
          { key: 'no', header: 'Return No.', sortable: true },
          {
            key: 'returnDate',
            header: 'Document Date',
            sortable: true,
            render: (row) => formatDate(row.returnDate),
          },
          { key: 'customerName', header: 'Customer' },
          {
            key: 'amountIncludingVAT',
            header: 'Amount (Incl. VAT)',
            sortable: true,
            render: (row) => formatAmount(row.amountIncludingVAT, row.currencyCode),
          },
        ]}
        emptyState="No return orders found"
      />
    </div>
  );
}
