import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'Nyxia - Guide Mystique',
  description: 'Ton assistant spirituel personnel',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.variable} antialiased font-sans bg-background text-foreground min-h-screen`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
