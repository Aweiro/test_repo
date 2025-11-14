'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from './BackLink.module.scss';
import { ProductsType } from '@/types/ProductsType';

type Props = {
  category?: ProductsType | '/';
};

export const BackLink = ({ category = '/' }: Props) => {
  const params = useSearchParams();

  const rawFrom = params?.get('from');

  // Якщо в URL є from= → повертаємось туди
  // Якщо нема → повертаємось у категорію
  const backHref = rawFrom
    ? decodeURIComponent(rawFrom)
    : `/${category}`;

  return (
    <Link href={backHref} className={`small-text ${styles['back-link']}`}>
      <span className="icon icon--arrow-left" />
      <p>Back</p>
    </Link>
  );
};