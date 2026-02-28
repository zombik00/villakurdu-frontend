'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import {
  Menu,
  X,
  User,
  LogOut,
  Heart,
  Settings,
  Building2,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/lib/constants';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import SearchBar from '@/components/common/SearchBar';
export default function Header() {
  const locale = useLocale();
  const t = useTranslations('nav');
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const localePath = (path: string) => `/${locale}${path}`;

  return (
    <header className="sticky top-0 z-40 glass">
      <div className="container-app">
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo */}
          <Link
            href={localePath(ROUTES.HOME)}
            className="flex items-center gap-2 shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-primary-600">Villa</span>
              <span className="text-secondary-800">Kurdu</span>
            </span>
          </Link>

          {/* Desktop search bar (compact) */}
          <div className="hidden md:flex flex-1 justify-center px-8 max-w-xl">
            <SearchBar variant="compact" className="w-full max-w-md" />
          </div>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-2">
            {/* Become a host link */}
            {isAuthenticated && user?.role !== 'host' && (
              <Link
                href={localePath(ROUTES.HOST_DASHBOARD)}
                className="text-sm font-medium text-secondary-700 hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-warm-50 transition-colors"
              >
                {t('become_host')}
              </Link>
            )}

            <LanguageSwitcher />

            {/* Auth buttons or user menu */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full border border-warm-300 hover:shadow-card transition-shadow"
                >
                  <Menu className="h-4 w-4 text-secondary-600 ml-1" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white text-sm font-medium">
                    {user.first_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                </button>
                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-modal border border-warm-200 py-1 z-50 animate-scale-in">
                      <div className="px-4 py-3 border-b border-warm-100">
                        <p className="text-sm font-medium text-secondary-900">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-xs text-secondary-500">{user.email}</p>
                      </div>
                      <Link
                        href={localePath(ROUTES.FAVORITES)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary-700 hover:bg-warm-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Heart className="h-4 w-4" />
                        {t('favorites')}
                      </Link>
                      <Link
                        href={localePath(ROUTES.PROFILE)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary-700 hover:bg-warm-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        {t('profile')}
                      </Link>
                      <Link
                        href={localePath(ROUTES.SETTINGS)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary-700 hover:bg-warm-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        {t('settings')}
                      </Link>
                      {user.role === 'host' && (
                        <Link
                          href={localePath(ROUTES.HOST_DASHBOARD)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary-700 hover:bg-warm-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Building2 className="h-4 w-4" />
                          {t('host_dashboard')}
                        </Link>
                      )}
                      <div className="border-t border-warm-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logout();
                          }}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          {t('logout')}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href={localePath(ROUTES.LOGIN)}
                  className="text-sm font-medium text-secondary-700 hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-warm-50 transition-colors"
                >
                  {t('login')}
                </Link>
                <Link
                  href={localePath(ROUTES.REGISTER)}
                  className="text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg transition-colors"
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-secondary-600 hover:bg-warm-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-warm-200 animate-fade-in">
          <div className="container-app py-4 space-y-2">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-3 bg-warm-50 rounded-xl mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white font-medium">
                    {user.first_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs text-secondary-500">{user.email}</p>
                  </div>
                </div>
                <MobileMenuLink
                  href={localePath(ROUTES.FAVORITES)}
                  icon={<Heart className="h-5 w-5" />}
                  label={t('favorites')}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <MobileMenuLink
                  href={localePath(ROUTES.PROFILE)}
                  icon={<User className="h-5 w-5" />}
                  label={t('profile')}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <MobileMenuLink
                  href={localePath(ROUTES.SETTINGS)}
                  icon={<Settings className="h-5 w-5" />}
                  label={t('settings')}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                {user.role === 'host' && (
                  <MobileMenuLink
                    href={localePath(ROUTES.HOST_DASHBOARD)}
                    icon={<Building2 className="h-5 w-5" />}
                    label={t('host_dashboard')}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                )}
                <div className="pt-2 border-t border-warm-200">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-3 w-full px-3 py-3 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">{t('logout')}</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href={localePath(ROUTES.LOGIN)}
                  className="block w-full text-center py-3 text-sm font-medium text-secondary-700 border border-warm-300 rounded-xl hover:bg-warm-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('login')}
                </Link>
                <Link
                  href={localePath(ROUTES.REGISTER)}
                  className="block w-full text-center py-3 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('register')}
                </Link>
              </>
            )}
            <div className="pt-2 border-t border-warm-200">
              <LanguageSwitcher className="w-full" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function MobileMenuLink({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-3 text-secondary-700 rounded-xl hover:bg-warm-50 transition-colors"
      onClick={onClick}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}
