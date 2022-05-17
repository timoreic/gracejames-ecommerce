import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import type { RootState } from '../app/store';
import type { OrderType } from '../types/OrderTypes';

interface OrdersAllState {
  orders: OrderType[];
  status: string;
  error: null | string;
}

const initialState: OrdersAllState = {
  orders: [],
  status: 'idle',
  error: null,
};

export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAllOrders',
  async (token: string, { rejectWithValue }) => {
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get('/api/orders/', config);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const ordersAllSlice = createSlice({
  name: 'ordersAll',
  initialState,
  reducers: {
    resetOrdersAllState: (state) => {
      state.status = 'idle';
      state.error = null;
      state.orders = [];
    },
  },
  extraReducers(builder) {
    builder
      // fetchAllOrders
      .addCase(fetchAllOrders.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action: any) => {
        state.status = 'failed';
        if (action.payload.non_field_errors) {
          state.error = action.payload.non_field_errors;
        } else {
          state.error = action.error.message!;
        }
      });
  },
});

export default ordersAllSlice.reducer;

export const { resetOrdersAllState } = ordersAllSlice.actions;

export const selectOrdersAllState = (state: RootState) => state.ordersAll;
