"use client";

import { Check, Loader2, RotateCw } from 'lucide-react';
import { FormEvent, useMemo, useState, useTransition } from 'react';
import { createReturnOrderAction } from '@/app/portal/shipments/[no]/actions';
import { Button } from './ui/button';
import type { SalesShipmentLine } from '@/lib/types';

interface Props {
  shipmentNo: string;
  lines: SalesShipmentLine[];
}

export function ReturnFromShipment({ shipmentNo, lines }: Props) {
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const selectedCount = useMemo(
    () => Object.values(selected).filter((qty) => qty > 0).length,
    [selected]
  );

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payloadLines = Object.entries(selected)
      .map(([lineNo, quantity]) => ({ lineNo: Number(lineNo), quantity }))
      .filter((line) => line.quantity > 0);

    if (payloadLines.length === 0) return;

    startTransition(async () => {
      try {
        await createReturnOrderAction({ shipmentNo, lines: payloadLines });
        setStatus('success');
        setErrorMessage('');
      } catch (error) {
        console.error(error);
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Unable to create return order');
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="rounded-lg border bg-white p-3 text-sm shadow-sm dark:border-slate-800 dark:bg-surface-dark">
        <p className="font-semibold text-slate-800 dark:text-slate-100">Select lines to return</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Choose lines and enter the quantity to return.</p>
      </div>

      <div className="space-y-2">
        {lines.map((line) => {
          const currentQty = selected[line.lineNo] ?? 0;
          return (
            <div
              key={line.id}
              className="flex flex-col gap-3 rounded-xl border bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-surface-dark sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-50">{line.description || line.itemNo}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Line {line.lineNo} • Shipped {line.quantityShipped}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={0}
                  max={line.quantityShipped}
                  value={currentQty}
                  onChange={(e) => setSelected((prev) => ({ ...prev, [line.lineNo]: Number(e.target.value) }))}
                  className="w-28 rounded-lg border px-3 py-2 text-sm focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                  aria-label={`Quantity to return for line ${line.lineNo}`}
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">Max {line.quantityShipped}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
        <span>{selectedCount} line(s) selected</span>
        <div className="flex items-center gap-2">
          {status === 'success' && (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <Check size={14} />
              Return created
            </span>
          )}
          {status === 'error' && (
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <RotateCw size={14} />
              {errorMessage || 'Try again'}
            </span>
          )}
          <Button type="submit" size="sm" disabled={isPending || selectedCount === 0}>
            {isPending ? <Loader2 className="animate-spin" size={16} /> : 'Create Return'}
          </Button>
        </div>
      </div>
      {status === 'error' && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-100">
          {errorMessage || 'Unable to create return order. Please try again.'}
        </div>
      )}
    </form>
  );
}
