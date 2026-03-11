'use client';

import NextTopLoader from 'nextjs-toploader';
import { loaderTemplate } from './loaderTemplate';

export default function TopLoader() {
  return (
    <NextTopLoader template={loaderTemplate} />
  );
} 