import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

import { ThemeProvider } from '@/components/theme-provider';
import AuthProvider from '@/components/wrappers/auth-provider';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RentFit - AI Rental Assistant',
  description: 'RentFit - Your AI-powered rental assistant',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
