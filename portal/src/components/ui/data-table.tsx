"use client";

import { ArrowUpDown, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { Button } from './button';

export interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKey?: keyof T;
  emptyState?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  searchKey,
  emptyState = 'No records found',
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filtered = useMemo(() => {
    if (!query || !searchKey) return data;
    return data.filter((row) => {
      const value = row[searchKey];
      return value?.toString().toLowerCase().includes(query.toLowerCase());
    });
  }, [data, query, searchKey]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal === bVal) return 0;
      if (aVal === undefined || aVal === null) return -1;
      if (bVal === undefined || bVal === null) return 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return sortDir === 'asc' ? -1 : 1;
    });
  }, [filtered, sortDir, sortKey]);

  const toggleSort = (key: keyof T) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir('asc');
    } else {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    }
  };

  return (
    <div className="space-y-3">
      {searchKey && (
        <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 shadow-sm dark:border-slate-800 dark:bg-surface-dark">
          <Search size={16} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent text-sm focus:outline-none"
          />
        </div>
      )}

      <div className="overflow-hidden rounded-xl border shadow-sm dark:border-slate-800">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-900">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {column.sortable && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-slate-500"
                        onClick={() => toggleSort(column.key)}
                      >
                        <ArrowUpDown size={14} />
                      </Button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-surface-dark">
            {sorted.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400"
                >
                  {emptyState}
                </td>
              </tr>
            )}
            {sorted.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                {columns.map((column) => (
                  <td key={String(column.key)} className="whitespace-nowrap px-4 py-3 text-sm text-slate-800 dark:text-slate-100">
                    {column.render ? column.render(row) : String(row[column.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
