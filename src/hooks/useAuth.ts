'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/lib/constants';

/**
 * Basic auth hook -- returns auth state and actions.
 */
export function useAuth() {
  const store = useAuthStore();
  return store;
}

/**
 * Redirect to login if user is not authenticated.
 * Use in pages that require authentication.
 *
 * Waits for Zustand hydration before making redirect decisions.
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading, user, loadUser } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);

  // Wait for Zustand persist hydration
  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    // If already hydrated (e.g. SSR or fast load)
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
    }
    return () => { unsub(); };
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (!isAuthenticated) {
      const segments = pathname.split('/').filter(Boolean);
      const localePrefix = segments[0] || 'tr';
      router.replace(`/${localePrefix}${ROUTES.LOGIN}?redirect=${encodeURIComponent(pathname)}`);
    } else if (!user && !isLoading) {
      loadUser();
    }
  }, [hydrated, isAuthenticated, isLoading, user, router, pathname, loadUser]);

  return { user, isLoading: isLoading || !hydrated, isAuthenticated };
}

/**
 * Redirect away from login/register pages if already authenticated.
 */
export function useRedirectIfAuthenticated(redirectTo?: string) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isAuthenticated) {
      if (redirectTo) {
        router.replace(redirectTo);
      } else {
        const segments = pathname.split('/').filter(Boolean);
        const localePrefix = segments[0] || 'tr';
        router.replace(`/${localePrefix}${ROUTES.HOME}`);
      }
    }
  }, [isAuthenticated, router, pathname, redirectTo]);
}
