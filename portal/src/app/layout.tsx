import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

const font = Space_Grotesk({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Business Central Customer Portal',
  description: 'Self-service portal for BC customers',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.className} bg-surface-light text-slate-900 antialiased dark:bg-base-dark dark:text-gray-100`}>
        <ThemeProvider>
          <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-base-dark dark:via-base-dark dark:to-base-dark">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
