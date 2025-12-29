import { redirect } from 'next/navigation';
import { getWorksOrders } from '@/lib/bc';
import { getCurrentCustomerNo } from '@/lib/customer';
import type { WorksOrder } from '@/lib/types';
import { WorksOrdersTable } from './table';

export default async function WorksOrdersPage() {
  const customerNo = getCurrentCustomerNo();
  if (!customerNo) {
    redirect('/login');
  }

  const worksOrders: WorksOrder[] = await getWorksOrders(customerNo);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">Repairs</p>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Works Orders</h1>
      </div>

      <WorksOrdersTable worksOrders={worksOrders} />
    </div>
  );
}
