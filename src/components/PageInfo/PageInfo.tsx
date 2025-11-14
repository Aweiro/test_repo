import React, { useEffect, useState } from 'react';

export const PageInfo = ({ title, count }: { title: string; count: number }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <div className='page__info'>
      <h1>{title}</h1>
      <p className='body-text page__info-count'>{count} items</p>
    </div>
  );
};
