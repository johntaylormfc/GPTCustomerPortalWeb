import { DataTable } from '@/components/ui/data-table';
import { getOutstandingOrders } from '@/lib/bc';
import { getCurrentCustomerNo } from '@/lib/customer';
import { formatAmount, formatDate } from '@/lib/format';
import type { SalesOrder } from '@/lib/types';
import { redirect } from 'next/navigation';

export default async function OrdersPage() {
  const customerNo = getCurrentCustomerNo();
  if (!customerNo) {
    redirect('/login');
  }
  const orders: SalesOrder[] = customerNo ? await getOutstandingOrders(customerNo) : await getOutstandingOrders();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">Documents</p>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Outstanding Sales Orders</h1>
      </div>

      <DataTable<SalesOrder>
        data={orders}
        searchKey="no"
        columns={[
          { key: 'no', header: 'Order No.', sortable: true },
          {
            key: 'orderDate',
            header: 'Order Date',
            sortable: true,
            render: (row) => formatDate(row.orderDate),
          },
          { key: 'customerName', header: 'Customer' },
          {
            key: 'outstandingQuantity',
            header: 'Outstanding Qty.',
            sortable: true,
            render: (row) => row.outstandingQuantity ?? 0,
          },
          { key: 'status', header: 'Status', sortable: true },
          {
            key: 'amountIncludingVAT',
            header: 'Amount (Incl. VAT)',
            sortable: true,
            render: (row) => formatAmount(row.amountIncludingVAT, row.currencyCode),
          },
        ]}
        emptyState="No orders found"
      />
    </div>
  );
}
