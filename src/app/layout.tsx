import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VillaKurdu - Türkiye\'nin En Güzel Tatil Evleri',
  description: 'Türkiye genelinde villa, daire ve butik otel kiralama platformu.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
