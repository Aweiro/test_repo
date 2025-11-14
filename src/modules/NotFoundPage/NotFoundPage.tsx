import React from 'react';
import styles from './NotFoundPage.module.scss';
import Link from 'next/link';
import Image from 'next/image';

export const NotFoundPage = () => {
  return (
    <div className={`container section ${styles['not-found']}`}>
      <Image
        src='/img/page-not-found.png'
        className={`not-found__img ${styles['not-found__img']}`}
        alt='NotFound'
				width={100}
				height={100}
      />
      <h1 className={styles['not-found__title']}>Page not found</h1>
      <Link className={styles['not-found__link']} href={'/'}>
        Go to home
      </Link>
    </div>
  );
};
