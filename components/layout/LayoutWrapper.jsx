'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { TaskProvider } from '@/context/TaskContext';
export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  // Exact routes without layout
  const noLayoutExactRoutes = ['/login', '/register'];

  // Hide layout if:
  // 1. Exact match (login, register)
  // 2. Any admin route (/admin, /admin/*)
  const hideLayout =
    noLayoutExactRoutes.includes(pathname) ||
    pathname.startsWith('/admin');

  return (
    <>
      {!hideLayout && <Header />}
      <TaskProvider>
      {children}
      </TaskProvider>
      {!hideLayout && <Footer />}
    </>
  );
}
