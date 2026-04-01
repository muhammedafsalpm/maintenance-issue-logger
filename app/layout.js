import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Maintenance Issue Logger | Property Management',
  description: 'Track and manage property maintenance issues efficiently',
  keywords: 'maintenance, property, issue tracking, work order',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
