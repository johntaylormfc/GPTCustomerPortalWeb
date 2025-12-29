"use client";

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/format';
import type { SalesShipment } from '@/lib/types';

interface Props {
  shipments: SalesShipment[];
}

export function ShipmentsTable({ shipments }: Props) {
  return (
    <DataTable<SalesShipment>
      data={shipments}
      searchKey="no"
      columns={[
        { key: 'no', header: 'Shipment No.', sortable: true },
        {
          key: 'postingDate',
          header: 'Posting Date',
          sortable: true,
          render: (row) => formatDate(row.postingDate),
        },
        { key: 'customerName', header: 'Customer' },
        { key: 'locationCode', header: 'Location' },
        {
          key: 'id',
          header: 'Details',
          render: (row) => (
            <Button variant="secondary" size="sm" asChild>
              <Link href={`/portal/shipments/${row.no}`}>
                View
                <ArrowRight size={14} />
              </Link>
            </Button>
          ),
        },
      ]}
      emptyState="No shipments found"
    />
  );
}
