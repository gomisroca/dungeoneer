import '@/styles/globals.css';

import { Raleway } from 'next/font/google';
import { type Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Provider as JotaiProvider } from 'jotai';

import Navbar from './_components/navbar';

export const metadata: Metadata = {
  title: 'Dungeoneer',
  description: 'FFXIV Tracker',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400', '600'], // Add specific weights if needed
});

function Footer() {
  return (
    <div className="pointer-events-none fixed right-0 bottom-0 left-0 z-0 flex flex-col items-end justify-end gap-1 p-2 text-xs opacity-20">
      <p className="line-clamp-1 text-end">FINAL FANTASY XIV © SQUARE ENIX CO., LTD.</p>
      <p className="line-clamp-2 text-end">FINAL FANTASY is a registered trademark of Square Enix Holdings Co., Ltd.</p>
    </div>
  );
}
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={raleway.className}>
      <body
        style={{ backgroundImage: "url('/bg.jpg')" }}
        className="min-h-screen bg-cover bg-fixed bg-center bg-no-repeat text-zinc-800 dark:text-zinc-200">
        <ThemeProvider attribute="class" defaultTheme="dark">
          <JotaiProvider>
            <Navbar />
            <main
              role="main"
              className="flex min-h-screen items-center justify-center overflow-x-hidden bg-gradient-to-br from-zinc-50 via-zinc-200/90 to-zinc-800/40 px-4 pt-20 pb-10 xl:px-32 dark:from-zinc-950 dark:via-zinc-900/95 dark:to-zinc-900/60">
              {children}
            </main>
            <Footer />
          </JotaiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
