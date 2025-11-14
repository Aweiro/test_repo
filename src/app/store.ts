import { configureStore, Middleware } from '@reduxjs/toolkit';
import favoritesReducer from '../features/favorites/favoritesSlice';
import cartReducer from '../features/cart/cartSlice';
import { productsApi } from './services/productsApi';

export const favoritesMiddleware: Middleware = store => next => action => {
  const result = next(action);
  const typedAction = action as { type: string };

  if (typedAction.type.startsWith('favorites/')) {
    const state = store.getState();

    localStorage.setItem('favorites', JSON.stringify(state.favorites.items));
  }

  return result;
};

export const cartMiddleware: Middleware = store => next => action => {
  const result = next(action);
  const typedAction = action as { type: string };

  if (typedAction.type.startsWith('cart/')) {
    const state = store.getState();

    localStorage.setItem('cart', JSON.stringify(state.cart.items));
  }

  return result;
};

const preloadedState = {
  favorites: {
    items: typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('favorites') || '[]')
      : [],
  },
	cart: {
    items: typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('cart') || '[]')
      : [],
  },
};

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    cart: cartReducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  preloadedState,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(favoritesMiddleware) // кастомний middleware
      .concat(cartMiddleware) // кастомний middleware
      .concat(productsApi.middleware), // RTK Query middleware
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
