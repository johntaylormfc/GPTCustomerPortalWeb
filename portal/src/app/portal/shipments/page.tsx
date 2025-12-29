import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getShipments } from '@/lib/bc';
import { getCurrentCustomerNo } from '@/lib/customer';
import type { SalesShipment } from '@/lib/types';
import { redirect } from 'next/navigation';
import { ShipmentsTable } from './table';

export default async function ShipmentsPage() {
  const customerNo = getCurrentCustomerNo();
  if (!customerNo) {
    redirect('/login');
  }
  const shipments: SalesShipment[] = customerNo ? await getShipments(customerNo) : await getShipments();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">Fulfilment</p>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Shipments</h1>
      </div>

      <ShipmentsTable shipments={shipments} />
    </div>
  );
}
