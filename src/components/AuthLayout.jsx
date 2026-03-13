'use client';

import { hasAccess, publicRoutes } from '@/lib/rolePermissions';

import HeaderSidebar from "@/components/HeaderSidebar/page";
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { usePathname } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';
import NextTopLoader from 'nextjs-toploader';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { loaderTemplate } from './loaderTemplate';
import muiTheme from './styles/MuiTheme';

export default function AuthLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {

    // Check if the current route is a public route
    // return;
    if (publicRoutes.includes(pathname)) {
      console.log("AuthLayout: Public route: ", pathname);
      return; // Allow access to public routes without authentication
    }

    // Check if user is authenticated
    if (!user) {
      console.log("AuthLayout: User not authenticated");
      router.push('/login');
      return;
    }

    const userRoles = user.roles || 'user';

    // Check access based on route and role
    if (!hasAccess(pathname, userRoles)) {
      console.log(`AuthLayout: Access denied to ${pathname} for role ${userRoles}`);
      router.push('/access-denied');
    }
  }, []);

  // Full screen routes don't need the HeaderSidebar
  const fullScreenRoutes = ['/login', '/signup', '/select-store', '/access-denied', '/ForgotPassword', '/ResetPassword'];
  const isFullScreenRoute = fullScreenRoutes.includes(pathname);

  return (
    <>
      <NextTopLoader
        // height={5}
        // showSpinner={false}
        template={loaderTemplate}
      />
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {isFullScreenRoute ? (
          children
        ) : (
          // <Suspense fallback={<div>Loading...</div>}>
          <HeaderSidebar>
            {children}
          </HeaderSidebar>
          // </Suspense>
        )}
      </ThemeProvider>
    </>
  );
} 