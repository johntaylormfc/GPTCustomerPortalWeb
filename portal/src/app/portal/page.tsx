import { revalidatePath } from 'next/cache';
import { ArrowRight, FileText, RefreshCcw, Wallet, Wrench } from 'lucide-react';
import { NavigationCard } from '@/components/ui/navigation-card';
import { SummaryCard } from '@/components/ui/summary-card';
import { SaveButton } from '@/components/save-button';
import { getCreditMemos, getCustomerDetail, getCustomerSummary, getInvoices, getOutstandingOrders, updateCustomerDetail } from '@/lib/bc';
import { getCurrentCustomerNo } from '@/lib/customer';
import { formatAmount } from '@/lib/format';
import { redirect } from 'next/navigation';

export default async function PortalPage() {
  const customerNo = getCurrentCustomerNo();

  if (!customerNo) {
    redirect('/login');
  }

  if (!customerNo) {
    return (
      <div className="rounded-xl border bg-amber-50 p-6 text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-100">
        Set BC_DEFAULT_CUSTOMER_NO in .env.local to load customer-specific data.
      </div>
    );
  }

  const [summary, detail, invoices, outstandingOrders, credits] = await Promise.all([
    getCustomerSummary(customerNo),
    getCustomerDetail(customerNo),
    getInvoices(customerNo),
    getOutstandingOrders(customerNo),
    getCreditMemos(customerNo),
  ]);

  async function saveCustomerDetail(formData: FormData) {
    'use server';
    const id = String(formData.get('id') ?? '');
    const etag = formData.get('etag')?.toString();
    const payload = {
      address: formData.get('address')?.toString() ?? undefined,
      address2: formData.get('address2')?.toString() ?? undefined,
      city: formData.get('city')?.toString() ?? undefined,
      postCode: formData.get('postCode')?.toString() ?? undefined,
      phoneNo: formData.get('phoneNo')?.toString() ?? undefined,
      email: formData.get('email')?.toString() ?? undefined,
      contact: formData.get('contact')?.toString() ?? undefined,
    };

    if (!id) return;

    await updateCustomerDetail(id, payload, etag);
    revalidatePath('/portal');
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">Dashboard</p>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">Welcome back</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{detail?.name || `Customer ${customerNo}`}</p>
        </div>
      </div>

      <div className="grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard title="Current Balance" value={formatAmount(summary?.balance)} icon={<Wallet />} />
        <SummaryCard title="Balance Due" value={formatAmount(summary?.balanceDueLcy)} icon={<FileText />} tone="warning" />
        <SummaryCard title="Sales (LCY)" value={formatAmount(summary?.salesLcy)} icon={<RefreshCcw />} tone="default" />
        <SummaryCard
          title="Outstanding Orders"
          value={outstandingOrders.length}
          icon={<ArrowRight />}
          hint="Orders with remaining quantities > 0"
        />
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-surface-dark">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">Customer</p>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Basic details</h2>
            {detail?.name && <p className="text-sm text-slate-500 dark:text-slate-400">{detail.name}</p>}
          </div>
        </div>
        <form action={saveCustomerDetail} className="grid gap-3 md:grid-cols-2">
          <input type="hidden" name="id" value={detail?.id ?? ''} />
          <input type="hidden" name="etag" value={detail?.etag ?? ''} />
          <label className="flex flex-col gap-1 text-sm text-slate-700 dark:text-slate-200">
            Address
            <input
              name="address"
              defaultValue={detail?.address}
              className="rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-surface-dark dark:text-slate-50"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-700 dark:text-slate-200">
            Address 2
            <input
              name="address2"
              defaultValue={detail?.address2}
              className="rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-surface-dark dark:text-slate-50"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-700 dark:text-slate-200">
            City
            <input
              name="city"
              defaultValue={detail?.city}
              className="rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-surface-dark dark:text-slate-50"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-700 dark:text-slate-200">
            Post Code
            <input
              name="postCode"
              defaultValue={detail?.postCode}
              className="rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-surface-dark dark:text-slate-50"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-700 dark:text-slate-200">
            Phone
            <input
              name="phoneNo"
              defaultValue={detail?.phoneNo}
              className="rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-surface-dark dark:text-slate-50"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-700 dark:text-slate-200">
            Email
            <input
              name="email"
              defaultValue={detail?.email}
              className="rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-surface-dark dark:text-slate-50"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-700 dark:text-slate-200">
            Contact
            <input
              name="contact"
              defaultValue={detail?.contact}
              className="rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-surface-dark dark:text-slate-50"
            />
          </label>
          <div className="md:col-span-2">
            <SaveButton />
          </div>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <NavigationCard
          title="Invoices"
          description="Search and download invoices."
          href="/portal/invoices"
          icon={<FileText />}
        />
        <NavigationCard
          title="Outstanding Orders"
          description="Orders with remaining quantities."
          href="/portal/orders"
          icon={<ArrowRight />}
        />
        <NavigationCard
          title="Works Orders"
          description="View repair works orders and timelines."
          href="/portal/works-orders"
          icon={<Wrench />}
        />
        <NavigationCard
          title="Credit Memos"
          description="View and download posted credits."
          href="/portal/credits"
          icon={<FileText />}
        />
        <NavigationCard
          title="Returns"
          description="Create and monitor return orders."
          href="/portal/returns"
          icon={<RefreshCcw />}
        />
        <NavigationCard
          title="Transactions"
          description="Open customer ledger entries."
          href="/portal/transactions"
          icon={<Wallet />}
        />
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-surface-dark">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Recent invoices</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Showing the latest 5</p>
          </div>
          <a href="/portal/invoices" className="text-sm font-medium text-sky-600 hover:underline dark:text-sky-400">
            View all
          </a>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-200">
          {invoices.slice(0, 5).map((invoice) => (
            <li key={invoice.id} className="flex items-center justify-between rounded-lg border px-3 py-2 dark:border-slate-800">
              <span className="font-semibold">{invoice.no}</span>
              <span className="text-slate-500 dark:text-slate-400">{formatAmount(invoice.amountIncludingVAT, invoice.currencyCode)}</span>
            </li>
          ))}
          {invoices.length === 0 && <li className="text-slate-500 dark:text-slate-400">No invoices available.</li>}
        </ul>
      </div>
    </div>
  );
}
