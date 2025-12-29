"use client";

import Link from 'next/link';
import { Download } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { formatAmount, formatDate } from '@/lib/format';
import type { SalesInvoice } from '@/lib/types';

interface Props {
  invoices: SalesInvoice[];
}

export function InvoicesTable({ invoices }: Props) {
  return (
    <DataTable<SalesInvoice>
      data={invoices}
      searchKey="no"
      columns={[
        { key: 'no', header: 'Invoice No.', sortable: true },
        {
          key: 'postingDate',
          header: 'Posting Date',
          sortable: true,
          render: (row) => formatDate(row.postingDate),
        },
        { key: 'customerName', header: 'Customer' },
        {
          key: 'amountIncludingVAT',
          header: 'Amount (Incl. VAT)',
          sortable: true,
          render: (row) => formatAmount(row.amountIncludingVAT, row.currencyCode),
        },
        {
          key: 'id',
          header: 'PDF',
          render: (row) => (
            <Button variant="secondary" size="sm" asChild>
              <Link href={`/api/invoices/${row.no}/pdf`} target="_blank">
                <Download size={14} />
                Download
              </Link>
            </Button>
          ),
        },
      ]}
      emptyState="No invoices found"
    />
  );
}
