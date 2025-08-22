import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { LanguageProvider } from '@/lib/i18n/context';

export const metadata: Metadata = {
  title: 'Azzinoth Coaching | Master Tier Toplane Coaching',
  description: 'Master tier toplane coaching by Azzinoth. Learn wave management, trading patterns, and macro strategies to dominate your lane and climb the ranked ladder.'
};

export const viewport: Viewport = {
  maximumScale: 1
};

const manrope = Manrope({ subsets: ['latin'] });

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`bg-white ${manrope.className}`}
    >
      <body className="min-h-[100dvh]">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
