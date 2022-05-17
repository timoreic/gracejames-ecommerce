import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

import { RootState } from '../app/store';

import type { AddToCartArgs, CartItemType } from '../types/CartTypes';

interface CartState {
  cartItems: CartItemType[];
  status: string;
  error: null | string;
}

const cartItemsListFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems')!)
  : [];

const initialState: CartState = {
  cartItems: cartItemsListFromStorage,
  status: 'idle',
  error: null,
};

export const addToCart = createAsyncThunk(
  'cartItems/addToCart',
  async (args: AddToCartArgs) => {
    const { productId, qty, sizeSurcharge, materialSurcharge } = args;
    const response = await axios.get(`/api/products/${productId}`);
    const cartItemToAdd = {
      product: response.data._id,
      name: response.data.name,
      qty: qty,
      basePrice: response.data.baseprice,
      sizeSurcharge: sizeSurcharge,
      materialSurcharge: materialSurcharge,
      image: response.data.image,
    };
    return cartItemToAdd;
  }
);

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.cartItems = state.cartItems.filter(
        (x) => x.product !== action.payload
      );
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeCartItems: (state) => {
      state.status = 'idle';
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    },
  },
  extraReducers(builder) {
    builder
      .addCase(addToCart.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const cartItemToAdd = action.payload;
        const existItem = state.cartItems.find(
          (x) => x.product === cartItemToAdd.product
        );

        if (existItem) {
          state.cartItems = state.cartItems.map((x) =>
            x.product === existItem.product ? cartItemToAdd : x
          );
        } else {
          state.cartItems.push(cartItemToAdd);
        }
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message!;
      });
  },
});

export default cartSlice.reducer;

export const selectCartState = (state: RootState) => state.cart;

export const { removeFromCart, removeCartItems } = cartSlice.actions;
