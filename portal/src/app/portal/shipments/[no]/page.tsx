import { notFound } from 'next/navigation';
import { Package, Truck } from 'lucide-react';
import { getShipment, getShipmentLines } from '@/lib/bc';
import { ReturnFromShipment } from '@/components/return-from-shipment';
import { formatDate } from '@/lib/format';

export default async function ShipmentDetailPage({ params }: { params: { no: string } }) {
  const shipment = await getShipment(params.no);
  if (!shipment) return notFound();

  const lines = await getShipmentLines(params.no);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <Truck size={16} />
          <span className="text-sm uppercase font-semibold">Shipment {shipment.no}</span>
        </div>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">{shipment.customerName}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Posted {formatDate(shipment.postingDate)} · Location {shipment.locationCode || 'N/A'} · External {shipment.externalDocumentNo || '—'}
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-surface-dark">
        <div className="flex items-center gap-3 pb-3 text-slate-800 dark:text-slate-100">
          <Package size={18} />
          <h2 className="text-lg font-semibold">Lines</h2>
        </div>
        <div className="space-y-3">
          {lines.map((line) => (
            <div
              key={line.id}
              className="flex flex-col gap-2 rounded-xl border bg-slate-50 p-3 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-50">{line.description || line.itemNo}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Line {line.lineNo}</p>
                </div>
                <div className="text-right text-xs text-slate-500 dark:text-slate-400">
                  <p>Qty shipped: {line.quantityShipped}</p>
                  <p>Qty invoiced: {line.quantityInvoiced}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ReturnFromShipment shipmentNo={shipment.no} lines={lines} />
    </div>
  );
}
