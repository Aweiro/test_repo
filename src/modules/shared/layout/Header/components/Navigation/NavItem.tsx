'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';
import styles from './Navigation.module.scss';
import React, { useContext } from 'react';
import { HeaderContext } from '../../context/HeaderContext';

type Props = {
  to: string;
  children: React.ReactNode;
};

export const NavItem = ({ to, children }: Props) => {
  const { setShowNavigation } = useContext(HeaderContext);
  const pathname = usePathname();
  // const isActive = pathname === to;
  const isActive = pathname === to || (to !== '/' && pathname?.startsWith(`${to}/`));

  return (
    <li className={`uppercase-text ${styles['nav__links--item']}`}>
      <Link
        href={to}
        className={classNames(styles['nav__links--link'], {
          [styles.active]: isActive,
        })}
        onClick={() => setShowNavigation(false)}
      >
        {children}
      </Link>
    </li>
  );
};
