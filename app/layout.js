import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Maintenance Issue Logger | Deluxe Stays',
  description: 'Track and manage property maintenance issues efficiently',
  keywords: 'maintenance, property, issue tracking, work order',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} transition-colors duration-300`}>
        {children}
      </body>
    </html>
  );
}
