import React from 'react';
import styles from './ProductCard.module.scss';
import Link from 'next/link'; // заміна react-router-dom
// import { usePathname } from 'next/navigation'; // заміна useLocation
import { Product } from '../../types/ProductType';
import { PaymentsButtons } from '../PaymentsButtons';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { usePathname, useSearchParams } from 'next/navigation';

interface Props {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<Props> = React.memo(({ product, className }) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const filteredSearch = new URLSearchParams(params?.toString());
    filteredSearch.delete('from');

    const search = filteredSearch.toString() ? `?${filteredSearch.toString()}` : '';

    const from = `${pathname}${search}`; // це поточна сторінка, звідки відкрили

    const html = document.documentElement;
    html.style.scrollBehavior = 'smooth';

    router
      .push(
        `/${product.category}/${product.itemId}${!pathname?.startsWith(`/${product.category}`) ? `?from=${encodeURIComponent(from)}` : ''}`,
      )
      .finally(() => {
        window.scrollTo({ top: 0 });
        html.style.scrollBehavior = '';
      });
  };

  const LinkDetails = ({
    children,
    linkClassName,
  }: {
    children: React.ReactNode;
    linkClassName: string;
  }) => {
    // const pathname = usePathname();
    // const params = useSearchParams();
    return (
      <Link
        href={`/${product.category}/${product.itemId}`}
        className={linkClassName}
        onClick={handleClick}
      >
        {children}
      </Link>
    );
  };

  return (
    <div className={`${styles['product-card']} ${className ? className : ''}`}>
      <LinkDetails linkClassName={styles['product-card__img-container']}>
        <Image
          src={'/' + product.image}
          alt='product'
          width={100}
          height={100}
          className={styles['product-card__img']}
        />
      </LinkDetails>

      <LinkDetails linkClassName={`body-text ${styles['product-card__title']}`}>
        {product.name}
      </LinkDetails>

      <div className={styles['product-card__price-row']}>
        <h3 className={styles['product-card__price-current']}>${product.price}</h3>

        <h3 className={styles['product-card__price-prev']}>${product.fullPrice}</h3>
      </div>

      <hr className={styles['product-card__line']} />

      <div className={styles['product-card__info']}>
        <div className={styles['product-card__info-row']}>
          <p className={`small-text ${styles['product-card__info-name']}`}>Screen</p>
          <p className={`small-text ${styles['product-card__info-value']}`}>{product.screen}</p>
        </div>
        <div className={styles['product-card__info-row']}>
          <p className={`small-text ${styles['product-card__info-name']}`}>Capacity</p>
          <p className={`small-text ${styles['product-card__info-value']}`}>{product.capacity}</p>
        </div>
        <div className={styles['product-card__info-row']}>
          <p className={`small-text ${styles['product-card__info-name']}`}>RAM</p>
          <p className={`small-text ${styles['product-card__info-value']}`}>{product.ram}</p>
        </div>
      </div>

      <PaymentsButtons product={product.itemId} />
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
