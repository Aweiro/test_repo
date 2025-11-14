'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import classNames from 'classnames';
import styles from './Navigation.module.scss';
import React, { useContext } from 'react';
import { HeaderContext } from '../../context/HeaderContext';

type Props = {
  to: string;
  children: React.ReactNode;
};

export const NavButton = ({ to, children, ...props }: Props) => {
  const { setShowNavigation } = useContext(HeaderContext);
  const pathname = usePathname();
  const params = useSearchParams();
  const isActive = pathname === to || (to !== '/' && pathname?.startsWith(`${to}/`));

  const filteredSearch = new URLSearchParams(params?.toString());
  filteredSearch.delete('from');
  const search = filteredSearch.toString() ? `?${filteredSearch.toString()}` : '';
  const from = `${pathname}${search}`;

  return (
    <li className={styles['nav__buttons--item']}>
      <Link
        href={`${to}?from=${encodeURIComponent(from)}`}
        className={classNames(styles['nav__buttons--link'], {
          [styles.active]: isActive,
        })}
        onClick={() => setShowNavigation(false)}
        {...props}
      >
        {children}
      </Link>
    </li>
  );
};
