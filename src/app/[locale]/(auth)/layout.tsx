import Link from 'next/link';
import { Building2 } from 'lucide-react';

export default function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale || 'tr';

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 via-white to-primary-50 flex flex-col">
      {/* Simple header with logo */}
      <header className="py-6 px-6">
        <Link href={`/${locale}`} className="inline-flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">
            <span className="text-primary-600">Villa</span>
            <span className="text-secondary-800">Kurdu</span>
          </span>
        </Link>
      </header>

      {/* Centered content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
    </div>
  );
}
