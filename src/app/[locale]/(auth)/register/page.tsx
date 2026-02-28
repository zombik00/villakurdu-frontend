'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, User, Home } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { useAuth, useRedirectIfAuthenticated } from '@/hooks/useAuth';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const locale = useLocale();
  const t = useTranslations('auth');
  const router = useRouter();

  const { register, isLoading, error, clearError } = useAuth();

  useRedirectIfAuthenticated();

  const [role, setRole] = useState<'guest' | 'host'>('guest');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!firstName) errors.firstName = locale === 'tr' ? 'Ad gerekli' : 'First name is required';
    if (!lastName) errors.lastName = locale === 'tr' ? 'Soyad gerekli' : 'Last name is required';
    if (!email) errors.email = locale === 'tr' ? 'E-posta gerekli' : 'Email is required';
    if (!password) errors.password = locale === 'tr' ? 'Sifre gerekli' : 'Password is required';
    if (password.length < 8) errors.password = locale === 'tr' ? 'Sifre en az 8 karakter olmali' : 'Password must be at least 8 characters';
    if (password !== passwordConfirm) errors.passwordConfirm = locale === 'tr' ? 'Sifreler eslesmiyor' : 'Passwords do not match';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;

    try {
      await register({
        email,
        password,
        password_confirm: passwordConfirm,
        first_name: firstName,
        last_name: lastName,
        role,
      });
      router.push(`/${locale}`);
    } catch {
      // error is handled by the store
    }
  };

  return (
    <Card className="p-6 md:p-8 animate-fade-in-up">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-secondary-900">{t('register_title')}</h1>
        <p className="text-secondary-500 mt-1">{t('register_subtitle')}</p>
      </div>

      {/* Role toggle */}
      <div className="flex bg-warm-100 rounded-xl p-1 mb-6">
        <button
          type="button"
          onClick={() => setRole('guest')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all',
            role === 'guest'
              ? 'bg-white shadow-card text-primary-600'
              : 'text-secondary-500 hover:text-secondary-700'
          )}
        >
          <User className="h-4 w-4" />
          {t('register_as_guest')}
        </button>
        <button
          type="button"
          onClick={() => setRole('host')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all',
            role === 'host'
              ? 'bg-white shadow-card text-primary-600'
              : 'text-secondary-500 hover:text-secondary-700'
          )}
        >
          <Home className="h-4 w-4" />
          {t('register_as_host')}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label={t('first_name')}
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              setFormErrors((prev) => ({ ...prev, firstName: '' }));
            }}
            placeholder={locale === 'tr' ? 'Adiniz' : 'Your first name'}
            error={formErrors.firstName}
            autoComplete="given-name"
          />
          <Input
            label={t('last_name')}
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              setFormErrors((prev) => ({ ...prev, lastName: '' }));
            }}
            placeholder={locale === 'tr' ? 'Soyadiniz' : 'Your last name'}
            error={formErrors.lastName}
            autoComplete="family-name"
          />
        </div>

        <Input
          label={t('email')}
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setFormErrors((prev) => ({ ...prev, email: '' }));
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
              setFormErrors((prev) => ({ ...prev, password: '' }));
            }}
            placeholder="********"
            icon={<Lock className="h-4 w-4" />}
            error={formErrors.password}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-secondary-400 hover:text-secondary-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <Input
          label={t('password_confirm')}
          type={showPassword ? 'text' : 'password'}
          value={passwordConfirm}
          onChange={(e) => {
            setPasswordConfirm(e.target.value);
            setFormErrors((prev) => ({ ...prev, passwordConfirm: '' }));
          }}
          placeholder="********"
          icon={<Lock className="h-4 w-4" />}
          error={formErrors.passwordConfirm}
          autoComplete="new-password"
        />

        <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
          {t('register_button')}
        </Button>
      </form>

      <p className="text-center text-sm text-secondary-500 mt-6">
        {t('have_account')}{' '}
        <Link
          href={`/${locale}${ROUTES.LOGIN}`}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          {t('login_title')}
        </Link>
      </p>
    </Card>
  );
}
