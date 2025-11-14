'use client'; // потрібне для клієнтського рендера

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Breadcrumbs.module.scss';
import classNames from 'classnames';
import React from 'react';

interface Props {
  lastTitle?: string;
}

export const Breadcrumbs = ({ lastTitle }: Props) => {
  const pathname = usePathname() || '/';
  const pathnameArr = ['/', ...pathname.split('/').filter((el) => el)];

  if (lastTitle) {
    pathnameArr.pop();
    pathnameArr.push(lastTitle);
  }

  return (
    <div className={styles.breadcrumbs}>
      {pathnameArr.map((path, i) => {
        const isHome = path === '/';
        const normalizePath = path.charAt(0).toUpperCase() + path.slice(1);

        if (i === pathnameArr.length - 1) {
          return (
            <p key={i} className={`${styles.breadcrumbs__item} ${styles.active}`}>
              {normalizePath}
            </p>
          );
        }

        const pathSegments = lastTitle ? pathnameArr.slice(0, -1) : pathnameArr;

        const linkPath = isHome ? '/' : '/' + pathSegments.slice(1, i + 1).join('/');

        return (
          <React.Fragment key={i}>
            <Link
              href={linkPath}
              className={classNames(styles.breadcrumbs__item, {
                'icon icon--home': isHome,
              })}
            >
              {!isHome && normalizePath}
            </Link>
            <span className={`icon icon--arrow-right ${styles.breadcrumbs__arrow}`} />
          </React.Fragment>
        );
      })}
    </div>
  );
};
