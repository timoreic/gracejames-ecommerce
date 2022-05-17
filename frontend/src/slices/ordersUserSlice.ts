import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import type { RootState } from '../app/store';
import type { OrderType } from '../types/OrderTypes';

interface OrdersUserState {
  orders: OrderType[];
  status: string;
  error: null | string;
}

const initialState: OrdersUserState = {
  orders: [],
  status: 'idle',
  error: null,
};

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (token: string, { rejectWithValue }) => {
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get('/api/orders/myorders', config);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const ordersUserSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrdersUserState: (state) => {
      state.status = 'idle';
      state.error = null;
      state.orders = [];
    },
  },
  extraReducers(builder) {
    builder
      // fetchUserOrders
      .addCase(fetchUserOrders.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action: any) => {
        state.status = 'failed';
        if (action.payload.non_field_errors) {
          state.error = action.payload.non_field_errors;
        } else {
          state.error = action.error.message!;
        }
      });
  },
});

export default ordersUserSlice.reducer;

export const { resetOrdersUserState } = ordersUserSlice.actions;

export const selectOrdersUserState = (state: RootState) => state.ordersUser;
