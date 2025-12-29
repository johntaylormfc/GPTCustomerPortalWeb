"use client";

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { formatAmount, formatDate } from '@/lib/format';
import type { WorksOrder } from '@/lib/types';

interface Props {
  worksOrders: WorksOrder[];
}

export function WorksOrdersTable({ worksOrders }: Props) {
  return (
    <DataTable<WorksOrder>
      data={worksOrders}
      searchKey="worksOrderNo"
      columns={[
        { key: 'worksOrderNo', header: 'Works Order No.', sortable: true },
        { key: 'customerNo', header: 'Customer' },
        {
          key: 'issueDate',
          header: 'Issue Date',
          sortable: true,
          render: (row) => formatDate(row.issueDate),
        },
        {
          key: 'completionDate',
          header: 'Completion Date',
          sortable: true,
          render: (row) => formatDate(row.completionDate),
        },
        { key: 'status', header: 'Status', sortable: true },
        { key: 'jobType', header: 'Job Type' },
        {
          key: 'totalInclVat',
          header: 'Total (Incl. VAT)',
          sortable: true,
          render: (row) => formatAmount(row.totalInclVat),
        },
        {
          key: 'id',
          header: 'Details',
          render: (row) => (
            <Button variant="secondary" size="sm" asChild>
              <Link href={`/portal/works-orders/${row.worksOrderNo}`}>
                View
                <ArrowRight size={14} />
              </Link>
            </Button>
          ),
        },
      ]}
      emptyState="No works orders found"
    />
  );
}
