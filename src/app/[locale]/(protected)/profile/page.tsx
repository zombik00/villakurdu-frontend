'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Mail, Phone, Shield, Calendar, Settings, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

export default function ProfilePage() {
  const locale = useLocale();
  const t = useTranslations('nav');
  const tAuth = useTranslations('auth');
  const tCommon = useTranslations('common');
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="container-app py-8 md:py-12 max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-8">
        {t('profile')}
      </h1>

      {/* Profile card */}
      <Card className="p-6 md:p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white text-3xl font-bold shrink-0">
            {user.first_name?.[0]?.toUpperCase() || 'U'}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <h2 className="text-xl font-bold text-secondary-900">
                {user.first_name} {user.last_name}
              </h2>
              {user.is_verified && (
                <Badge variant="accent">
                  <Shield className="h-3 w-3 mr-1" />
                  {tCommon('verified')}
                </Badge>
              )}
            </div>
            <Badge variant={user.role === 'host' ? 'primary' : 'secondary'}>
              {user.role === 'host'
                ? (locale === 'tr' ? 'Ev Sahibi' : 'Host')
                : (locale === 'tr' ? 'Misafir' : 'Guest')}
            </Badge>
            <p className="text-sm text-secondary-500 mt-2">
              {locale === 'tr' ? 'Uyelik tarihi:' : 'Member since:'}{' '}
              {formatDate(user.created_at, `${locale}-TR`)}
            </p>
          </div>

          <Link href={`/${locale}${ROUTES.SETTINGS}`}>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
              {t('settings')}
            </Button>
          </Link>
        </div>
      </Card>

      {/* Info sections */}
      <Card className="divide-y divide-warm-100 mb-6">
        <InfoRow
          icon={<Mail className="h-5 w-5 text-secondary-400" />}
          label={tAuth('email')}
          value={user.email}
        />
        <InfoRow
          icon={<Phone className="h-5 w-5 text-secondary-400" />}
          label={locale === 'tr' ? 'Telefon' : 'Phone'}
          value={user.phone || (locale === 'tr' ? 'Belirtilmemis' : 'Not provided')}
        />
        <InfoRow
          icon={<Calendar className="h-5 w-5 text-secondary-400" />}
          label={locale === 'tr' ? 'Uyelik Tarihi' : 'Member Since'}
          value={formatDate(user.created_at, `${locale}-TR`)}
        />
      </Card>

      {/* Quick links */}
      <Card className="divide-y divide-warm-100">
        <QuickLink
          href={`/${locale}${ROUTES.FAVORITES}`}
          label={t('favorites')}
        />
        <QuickLink
          href={`/${locale}${ROUTES.BOOKINGS}`}
          label={locale === 'tr' ? 'Rezervasyonlarim' : 'My Bookings'}
        />
        <QuickLink
          href={`/${locale}${ROUTES.MESSAGES}`}
          label={t('messages')}
        />
        {user.role === 'host' && (
          <QuickLink
            href={`/${locale}${ROUTES.HOST_DASHBOARD}`}
            label={t('host_dashboard')}
          />
        )}
        <QuickLink
          href={`/${locale}${ROUTES.SETTINGS}`}
          label={t('settings')}
        />
      </Card>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      {icon}
      <div className="flex-1">
        <p className="text-xs text-secondary-400 font-medium">{label}</p>
        <p className="text-sm text-secondary-900">{value}</p>
      </div>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between px-6 py-4 hover:bg-warm-50 transition-colors"
    >
      <span className="text-sm font-medium text-secondary-700">{label}</span>
      <ChevronRight className="h-4 w-4 text-secondary-400" />
    </Link>
  );
}
