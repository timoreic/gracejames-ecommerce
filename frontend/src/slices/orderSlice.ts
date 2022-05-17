import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import type { RootState } from '../app/store';
import type { CreateOrderArgs, OrderType } from '../types/OrderTypes';

interface OrderState {
  order: OrderType;
  status: string;
  error: null | string;
}

const initialState: OrderState = {
  order: {} as OrderType,
  status: 'idle',
  error: null,
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (order: CreateOrderArgs, { rejectWithValue }) => {
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${order.token}`,
      },
    };
    try {
      const response = await axios.post('/api/orders/add/', order, config);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.status = 'idle';
      state.order = {} as OrderType;
    },
  },
  extraReducers(builder) {
    builder
      // createOrder
      .addCase(createOrder.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action: any) => {
        state.status = 'failed';
        if (action.payload.non_field_errors) {
          state.error = action.payload.non_field_errors;
        } else {
          state.error = action.error.message!;
        }
      });
  },
});

export default orderSlice.reducer;

export const { resetOrder } = orderSlice.actions;

export const selectOrderState = (state: RootState) => state.order;
