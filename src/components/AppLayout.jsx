'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import HeaderSidebar from "./HeaderSidebar/page";

export default function AppLayout({ children }) {
  const pathname = usePathname();

  // Full screen routes don't need the HeaderSidebar
  const fullScreenRoutes = ['/login', '/signup', '/select-store', '/access-denied', '/ForgotPassword', '/ResetPassword', '/'];
  const isFullScreenRoute = fullScreenRoutes.includes(pathname);

  if (isFullScreenRoute) {
    return <>{children}</>;
  }

  return (
    <HeaderSidebar>
      {children}
    </HeaderSidebar>
  );
}
