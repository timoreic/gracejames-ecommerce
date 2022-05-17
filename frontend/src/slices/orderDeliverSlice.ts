import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import type { RootState } from '../app/store';
import type { DeliverOrderArgs } from '../types/OrderTypes';

interface OrderPayState {
  deliverResponse: string;
  status: string;
  error: null | string;
}

const initialState: OrderPayState = {
  deliverResponse: '',
  status: 'idle',
  error: null,
};

export const deliverOrder = createAsyncThunk(
  'deliverResponse/deliverOrder',
  async (args: DeliverOrderArgs, { rejectWithValue }) => {
    const { order, token } = args;
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.put(
        `/api/orders/${order._id}/deliver/`,
        {},
        config
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const orderDeliverSlice = createSlice({
  name: 'orderDeliver',
  initialState,
  reducers: {
    resetOrderDeliverState: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      // deliverOrder
      .addCase(deliverOrder.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(deliverOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(deliverOrder.rejected, (state, action: any) => {
        state.status = 'failed';
        if (action.payload.non_field_errors) {
          state.error = action.payload.non_field_errors;
        } else {
          state.error = action.error.message!;
        }
      });
  },
});

export default orderDeliverSlice.reducer;

export const { resetOrderDeliverState } = orderDeliverSlice.actions;

export const selectOrderDeliverState = (state: RootState) => state.orderDeliver;
