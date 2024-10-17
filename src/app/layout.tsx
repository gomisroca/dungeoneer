import '@/styles/globals.css';

import { Work_Sans } from 'next/font/google';
import { type Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

import { TRPCReactProvider } from '@/trpc/react';
import ThemeButton from './_components/themeButton';

export const metadata: Metadata = {
  title: 'Dungeoneer',
  description: 'FFXIV Tracker',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

const worksans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '600'], // Add specific weights if needed
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={worksans.className}>
      <body>
        <ThemeProvider attribute="class">
          <TRPCReactProvider>
            <div
              style={{ backgroundImage: "url('/bg.jpg')" }}
              className="min-h-screen bg-cover bg-fixed bg-center bg-no-repeat">
              <div className="absolute left-0 right-0 top-0 p-4">
                <ThemeButton />
              </div>
              <main
                role="main"
                className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 via-neutral-200/90 to-neutral-800/40 px-4 pb-10 pt-20 text-neutral-800 dark:from-neutral-950 dark:via-neutral-900/95 dark:to-neutral-900/60 dark:text-neutral-200 xl:px-32">
                {children}
              </main>
            </div>
          </TRPCReactProvider>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
