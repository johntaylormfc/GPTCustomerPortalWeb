"use client";

import { LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const [customerNo, setCustomerNo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerNo, password }),
      });

      if (!resp.ok) {
        const detail = await resp.json().catch(() => ({}));
        throw new Error(detail?.message || 'Unable to sign in');
      }

      router.push('/portal');
    } catch (err) {
      console.error(err);
      alert('Sign-in failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-surface-dark">
        <div className="mb-6 space-y-2">
          <p className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">Customer Portal</p>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Log in</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enter your customer number and portal password to continue.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Customer No.</label>
            <input
              required
              value={customerNo}
              onChange={(e) => setCustomerNo(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
              placeholder="e.g., 10000"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            <LogIn size={16} />
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </main>
  );
}
