import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BleuLemon - Generateur de Propositions Commerciales',
  description: 'Generez des propositions commerciales Atlassian professionnelles avec l\'IA',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${montserrat.className} bg-gray-50 min-h-screen`}>{children}</body>
    </html>
  );
}
