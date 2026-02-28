'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Home, Search, Heart, MessageCircle, User } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function MobileNav() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('nav');

  const localePath = (path: string) => `/${locale}${path}`;

  const tabs = [
    { href: localePath(ROUTES.HOME), icon: Home, label: t('home') },
    { href: localePath(ROUTES.SEARCH), icon: Search, label: t('search') },
    { href: localePath(ROUTES.FAVORITES), icon: Heart, label: t('favorites') },
    { href: localePath(ROUTES.MESSAGES), icon: MessageCircle, label: t('messages') },
    { href: localePath(ROUTES.PROFILE), icon: User, label: t('profile') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-warm-200 md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive = tab.href === localePath(ROUTES.HOME)
            ? pathname === tab.href
            : pathname === tab.href || pathname.startsWith(tab.href + '/');
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 w-full h-full text-xs transition-colors',
                isActive ? 'text-primary-600' : 'text-secondary-400 hover:text-secondary-600'
              )}
            >
              <Icon className={cn('h-5 w-5', isActive && 'fill-primary-600/10')} />
              <span className={cn('font-medium', isActive && 'text-primary-600')}>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
