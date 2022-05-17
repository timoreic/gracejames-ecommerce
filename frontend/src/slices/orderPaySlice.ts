import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import type { RootState } from '../app/store';
import type { PayOrderArgs } from '../types/OrderTypes';

interface OrderPayState {
  payResponse: string;
  status: string;
  error: null | string;
}

const initialState: OrderPayState = {
  payResponse: '',
  status: 'idle',
  error: null,
};

export const payOrder = createAsyncThunk(
  'payResponse/payOrder',
  async (args: PayOrderArgs, { rejectWithValue }) => {
    const { id, paymentResult, token } = args;
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.put(
        `/api/orders/${id}/pay/`,
        paymentResult,
        config
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const orderPaySlice = createSlice({
  name: 'orderPay',
  initialState,
  reducers: {
    resetOrderPayState: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      // payOrder
      .addCase(payOrder.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(payOrder.rejected, (state, action: any) => {
        state.status = 'failed';
        if (action.payload.non_field_errors) {
          state.error = action.payload.non_field_errors;
        } else {
          state.error = action.error.message!;
        }
      });
  },
});

export default orderPaySlice.reducer;

export const { resetOrderPayState } = orderPaySlice.actions;

export const selectOrderPayState = (state: RootState) => state.orderPay;
