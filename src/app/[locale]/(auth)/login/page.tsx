'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { useRedirectIfAuthenticated } from '@/hooks/useAuth';
import { ROUTES } from '@/lib/constants';

export default function LoginPage() {
  const locale = useLocale();
  const t = useTranslations('auth');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const { login, isLoading, error, clearError } = useAuth();

  useRedirectIfAuthenticated(redirectUrl || undefined);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email) errors.email = locale === 'tr' ? 'E-posta gerekli' : 'Email is required';
    if (!password) errors.password = locale === 'tr' ? 'Sifre gerekli' : 'Password is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;

    try {
      await login({ email, password });
      router.push(redirectUrl || `/${locale}`);
    } catch {
      // error is handled by the store
    }
  };

  return (
    <Card className="p-6 md:p-8 animate-fade-in-up">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-secondary-900">{t('login_title')}</h1>
        <p className="text-secondary-500 mt-1">{t('login_subtitle')}</p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t('email')}
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setFormErrors((prev) => ({ ...prev, email: undefined }));
          }}
          placeholder="ornek@email.com"
          icon={<Mail className="h-4 w-4" />}
          error={formErrors.email}
          autoComplete="email"
        />

        <div className="relative">
          <Input
            label={t('password')}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFormErrors((prev) => ({ ...prev, password: undefined }));
            }}
            placeholder="********"
            icon={<Lock className="h-4 w-4" />}
            error={formErrors.password}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-secondary-400 hover:text-secondary-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex items-center justify-end">
          <Link
            href={`/${locale}${ROUTES.FORGOT_PASSWORD}`}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            {t('forgot_password')}
          </Link>
        </div>

        <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
          {t('login_button')}
        </Button>
      </form>

      <p className="text-center text-sm text-secondary-500 mt-6">
        {t('no_account')}{' '}
        <Link
          href={`/${locale}${ROUTES.REGISTER}`}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          {t('register_title')}
        </Link>
      </p>
    </Card>
  );
}
