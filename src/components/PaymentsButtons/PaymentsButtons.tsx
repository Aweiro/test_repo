import styles from './PaymentsButtons.module.scss';
import { Button } from '../Button';
import { ButtonType } from '../../types/ButtonType';
import classNames from 'classnames';
import { Product } from '../../types/ProductType';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { toggleFavorite } from '../../features/favorites/favoritesSlice';
import { toggleCart } from '@/features/cart/cartSlice';

export const PaymentsButtons = ({
  isPage = false,
  product,
}: {
  isPage?: boolean;
  product: Product['id'];
}) => {
	const dispatch = useAppDispatch();
  const { items: favorites } = useAppSelector((state) => state.favorites);
  const { items: cart } = useAppSelector((state) => state.cart);
  const isActiveCart = cart.some((item) => item.id === product);

  return (
    <div
      className={classNames(styles.payments__buttons, {
        [styles.page]: isPage,
      })}
    >
      <Button
        isSelected={isActiveCart}
        className={`button-text ${styles['payments__buttons-add']}`}
        onClick={() => dispatch(toggleCart(product))}
      >
        {isActiveCart ? 'Added to cart' : 'Add to cart'}
      </Button>

      <Button
        isRatio={true}
        icon={ButtonType.Heart}
        isFavorite={true}
        iconActive={ButtonType.HeartFilled}
        isSelected={favorites.includes(product)}
        onClick={() => dispatch(toggleFavorite(product))}
      />
    </div>
  );
};
