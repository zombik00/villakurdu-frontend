'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  LayoutDashboard,
  Home,
  CalendarDays,
  MessageSquare,
  Star,
  Wallet,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export default function HostLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('host');
  const locale = useLocale();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      label: t('dashboard'),
      href: `/${locale}${ROUTES.HOST_DASHBOARD}`,
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      label: t('my_properties'),
      href: `/${locale}${ROUTES.HOST_PROPERTIES}`,
      icon: <Home className="h-5 w-5" />,
    },
    {
      label: t('bookings'),
      href: `/${locale}${ROUTES.HOST_BOOKINGS}`,
      icon: <CalendarDays className="h-5 w-5" />,
    },
    {
      label: t('messages'),
      href: `/${locale}${ROUTES.MESSAGES}`,
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      label: t('reviews'),
      href: `/${locale}${ROUTES.HOST_REVIEWS}`,
      icon: <Star className="h-5 w-5" />,
    },
    {
      label: t('payouts'),
      href: `/${locale}${ROUTES.HOST_PAYOUTS}`,
      icon: <Wallet className="h-5 w-5" />,
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex min-h-[calc(100vh-140px)]">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed bottom-20 right-4 z-40 md:hidden bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed md:sticky top-0 left-0 z-30 md:z-auto w-64 h-full md:h-auto bg-white border-r border-warm-200 transition-transform duration-300 md:translate-x-0 shrink-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-secondary-600 hover:bg-warm-50 hover:text-secondary-900'
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
