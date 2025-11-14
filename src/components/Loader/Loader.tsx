'use client';

import { useEffect, useState } from 'react';
import './Loader.scss';

export const Loader = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <div className='Loader' data-cy='loader'>
      <div className='Loader__content' />
    </div>
  );
};
