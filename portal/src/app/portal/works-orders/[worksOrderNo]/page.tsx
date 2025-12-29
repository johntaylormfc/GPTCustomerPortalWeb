import { notFound } from 'next/navigation';
import { ClipboardList, Clock, Download, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getWorksOrder, getWorksOrderEvents, getWorksOrderLines, getWorksOrderPdf } from '@/lib/bc';
import { getCurrentCustomerNo } from '@/lib/customer';
import { formatAmount, formatDate } from '@/lib/format';

export default async function WorksOrderDetailPage({ params }: { params: { worksOrderNo: string } }) {
  const customerNo = getCurrentCustomerNo();
  if (!customerNo) return notFound();

  const worksOrder = await getWorksOrder(params.worksOrderNo, customerNo);
  if (!worksOrder) return notFound();

  const [lines, events, pdfBase64] = await Promise.all([
    getWorksOrderLines(params.worksOrderNo),
    getWorksOrderEvents(params.worksOrderNo),
    getWorksOrderPdf(params.worksOrderNo),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <Wrench size={16} />
          <span className="text-sm font-semibold uppercase">Works Order {worksOrder.worksOrderNo}</span>
        </div>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">{worksOrder.customerNo}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Status {worksOrder.status || 'N/A'} · Job Type {worksOrder.jobType || 'N/A'} · Issue {formatDate(worksOrder.issueDate)}
        </p>
        <div className="pt-2">
          <Button variant="secondary" size="sm" asChild>
            <a href={`data:application/pdf;base64,${pdfBase64}`} download={`WorksOrder-${worksOrder.worksOrderNo}.pdf`}>
              <Download size={16} />
              Download PDF
            </a>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-surface-dark">
          <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Totals</p>
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">{formatAmount(worksOrder.totalInclVat)}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Ex VAT {formatAmount(worksOrder.total)}</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-surface-dark">
          <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Completion</p>
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">{formatDate(worksOrder.completionDate)}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Recalled {formatDate(worksOrder.recalledDate)}</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-surface-dark">
          <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Contact</p>
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">{worksOrder.phoneNo || '—'}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{worksOrder.email || '—'}</p>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-surface-dark">
        <div className="flex items-center gap-3 pb-3 text-slate-800 dark:text-slate-100">
          <ClipboardList size={18} />
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
                  <p className="font-semibold text-slate-900 dark:text-slate-50">{line.description || line.sorCode || 'Line'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">SOR {line.sorCode || '—'} · Line {line.lineNo}</p>
                </div>
                <div className="text-right text-xs text-slate-500 dark:text-slate-400">
                  <p>Qty {line.quantity ?? 0}</p>
                  <p>Total {formatAmount(line.totalInclVat)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Type {line.type || '—'}</span>
                <span>Issue {formatDate(line.issueDate)}</span>
              </div>
            </div>
          ))}
          {lines.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">No lines available.</p>}
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-surface-dark">
        <div className="flex items-center gap-3 pb-3 text-slate-800 dark:text-slate-100">
          <Clock size={18} />
          <h2 className="text-lg font-semibold">Events</h2>
        </div>
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex flex-col gap-1 rounded-xl border bg-slate-50 p-3 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-900 dark:text-slate-50">{event.eventType || 'Event'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(event.eventDate)}</p>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{event.detail || event.extraText || '—'}</p>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Attention {event.requiresAttention ? 'Yes' : 'No'}</span>
                <span>Stage {event.stage || '—'}</span>
              </div>
            </div>
          ))}
          {events.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">No events found.</p>}
        </div>
      </div>
    </div>
  );
}
