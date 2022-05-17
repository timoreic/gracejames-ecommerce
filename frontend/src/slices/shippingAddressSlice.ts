import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

import type { ShippingAddressType } from '../types/ShippingAddressTypes';

interface ShippingAddressState {
  shippingAddress: ShippingAddressType;
  status: string;
  error: null | string;
}

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress')!)
  : {};

const initialState: ShippingAddressState = {
  shippingAddress: shippingAddressFromStorage,
  status: 'idle',
  error: null,
};

export const shippingAddressSlice = createSlice({
  name: 'shippingAddress',
  initialState,
  reducers: {
    saveShippingAddress: (
      state,
      action: PayloadAction<ShippingAddressType>
    ) => {
      state.shippingAddress = action.payload;
      localStorage.setItem(
        'shippingAddress',
        JSON.stringify(state.shippingAddress)
      );
    },
  },
});

export default shippingAddressSlice.reducer;

export const selectShippingAddressState = (state: RootState) =>
  state.shippingAddress;

export const { saveShippingAddress } = shippingAddressSlice.actions;
