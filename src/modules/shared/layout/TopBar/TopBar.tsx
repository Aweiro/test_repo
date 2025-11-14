'use client';

import { useContext } from 'react';
import styles from './TopBar.module.scss';
import Link from 'next/link';
import classNames from 'classnames';
import { HeaderContext } from '../Header/context/HeaderContext';
import logo from '../../../../assets/img/Logo.svg';
import Image from 'next/image';

export const TopBar = () => {
  const { showNavigation, setShowNavigation } = useContext(HeaderContext);

  return (
    <div className={styles['top-bar']}>
      <div className={styles['top-bar__wrapper']}>
        <div className={styles['top-bar__left-block']}>
          <Link href="/" className={styles['top-bar__logo']}>
            <Image src={logo} alt="logo" />
          </Link>
        </div>

        <div className={styles['top-bar__right-block']}>
          <button
            className={classNames(
              'icon',
              { 'icon--menu': !showNavigation },
              { 'icon--close': showNavigation }
            )}
            onClick={() => setShowNavigation(prev => !prev)}
          />
        </div>
      </div>
    </div>
  );
};