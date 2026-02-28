'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Building2 } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

export default function Footer() {
  const locale = useLocale();
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');

  const localePath = (path: string) => `/${locale}${path}`;

  return (
    <footer className="bg-secondary-950 text-white/80">
      <div className="container-app py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* About */}
          <div className="col-span-2 md:col-span-1">
            <Link href={localePath(ROUTES.HOME)} className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-primary-400">Villa</span>
                <span className="text-white">Kurdu</span>
              </span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">
              {locale === 'tr'
                ? 'Turkiye\'nin en guzel tatil evlerini kesfetmenin en kolay yolu.'
                : 'The easiest way to discover the most beautiful holiday homes in Turkey.'}
            </p>
          </div>

          {/* For Guests */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              {locale === 'tr' ? 'Misafirler Icin' : 'For Guests'}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href={localePath(ROUTES.SEARCH)}
                  className="text-sm text-white/60 hover:text-primary-400 transition-colors"
                >
                  {t('search')}
                </Link>
              </li>
              <li>
                <Link
                  href={localePath(ROUTES.FAVORITES)}
                  className="text-sm text-white/60 hover:text-primary-400 transition-colors"
                >
                  {t('favorites')}
                </Link>
              </li>
              <li>
                <Link
                  href={localePath(ROUTES.BOOKINGS)}
                  className="text-sm text-white/60 hover:text-primary-400 transition-colors"
                >
                  {locale === 'tr' ? 'Rezervasyonlarim' : 'My Bookings'}
                </Link>
              </li>
              <li>
                <Link
                  href={localePath(ROUTES.MESSAGES)}
                  className="text-sm text-white/60 hover:text-primary-400 transition-colors"
                >
                  {t('messages')}
                </Link>
              </li>
            </ul>
          </div>

          {/* For Hosts */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              {locale === 'tr' ? 'Ev Sahipleri Icin' : 'For Hosts'}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href={localePath(ROUTES.HOST_DASHBOARD)}
                  className="text-sm text-white/60 hover:text-primary-400 transition-colors"
                >
                  {t('host_dashboard')}
                </Link>
              </li>
              <li>
                <Link
                  href={localePath(ROUTES.HOST_PROPERTIES)}
                  className="text-sm text-white/60 hover:text-primary-400 transition-colors"
                >
                  {t('list_property')}
                </Link>
              </li>
              <li>
                <Link
                  href={localePath(ROUTES.HOST_BOOKINGS)}
                  className="text-sm text-white/60 hover:text-primary-400 transition-colors"
                >
                  {locale === 'tr' ? 'Rezervasyonlar' : 'Bookings'}
                </Link>
              </li>
              <li>
                <Link
                  href={localePath(ROUTES.HOST_PAYOUTS)}
                  className="text-sm text-white/60 hover:text-primary-400 transition-colors"
                >
                  {locale === 'tr' ? 'Odemeler' : 'Payouts'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              {locale === 'tr' ? 'Destek' : 'Support'}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-white/60 hover:text-primary-400 transition-colors"
                >
                  {locale === 'tr' ? 'Yardim Merkezi' : 'Help Center'}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-white/60 hover:text-primary-400 transition-colors"
                >
                  {locale === 'tr' ? 'Guvenlik' : 'Safety'}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-white/60 hover:text-primary-400 transition-colors"
                >
                  {locale === 'tr' ? 'Iptal Politikasi' : 'Cancellation Policy'}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-white/60 hover:text-primary-400 transition-colors"
                >
                  {tCommon('contact')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} VillaKurdu. {locale === 'tr' ? 'Tum haklari saklidir.' : 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-4">
            {/* Social media placeholder icons */}
            {['X', 'IG', 'FB', 'YT'].map((social) => (
              <a
                key={social}
                href="#"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/50 hover:bg-white/20 hover:text-white transition-colors"
              >
                {social}
              </a>
            ))}
            <LanguageSwitcher compact />
          </div>
        </div>
      </div>
    </footer>
  );
}
