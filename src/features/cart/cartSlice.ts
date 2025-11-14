import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CartItem = {
  id: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    toggleCart: (state, action: PayloadAction<string>) => {
      const existsCart = state.items.some((unit) => unit.id === action.payload);

      state.items = existsCart
        ? state.items.filter((unit) => unit.id !== action.payload)
        : [...state.items, { id: action.payload, quantity: 1 }];
    },

    changeCartQuantity: (state, action: PayloadAction<{ id: string; delta: number }>) => {
      state.items = state.items
        .map((unit) =>
          unit.id === action.payload.id
            ? { ...unit, quantity: unit.quantity + action.payload.delta }
            : unit,
        )
        .filter((unit) => unit.quantity > 0);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const selectAllCartQuantity = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const { toggleCart, changeCartQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
