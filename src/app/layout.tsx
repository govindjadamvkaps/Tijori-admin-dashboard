import { Outfit } from 'next/font/google';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import AuthGuard from '@/components/AuthGaurd';
import StoreProvider from './StoreProvider';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <StoreProvider>
            <SidebarProvider>
              <AuthGuard>
                {children}
              </AuthGuard>
               <Toaster />
            </SidebarProvider>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
