'use client';

import React, { useEffect, useState } from 'react';
import styles from './Navigation.module.scss';
import { NavItem } from './NavItem';
import { NavButton } from './NavButton';
import { useAppSelector } from '../../../../../../app/hooks';
import { selectAllCartQuantity } from '@/features/cart/cartSlice';

export const Navigation = () => {
  const { items: favorites } = useAppSelector((state) => state.favorites);
  const allCartQuantity = useAppSelector(selectAllCartQuantity);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <nav className={styles.nav}>
      <ul className={styles.nav__links}>
        <NavItem to='/'>Home</NavItem>
        <NavItem to='/phones'>Phones</NavItem>
        <NavItem to='/tablets'>Tablets</NavItem>
        <NavItem to='/accessories'>Accessoires</NavItem>
      </ul>
      <ul className={styles.nav__buttons}>
        <NavButton to='/favorites'>
          <span className={`icon icon--favorites`} />
          {favorites.length > 0 && (
            <span className={styles['nav__buttons--count']}>{favorites.length}</span>
          )}
        </NavButton>
        <NavButton to='/cart'>
          <span className='icon icon--shopping' />
          {allCartQuantity > 0 && (
            <span className={styles['nav__buttons--count']}>{allCartQuantity}</span>
          )}
        </NavButton>
      </ul>
    </nav>
  );
};
