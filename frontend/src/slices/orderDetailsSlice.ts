import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import type { RootState } from '../app/store';
import type { FetchOrderDetailsArgs, OrderType } from '../types/OrderTypes';

interface OrderDetailsState {
  orderDetails: OrderType;
  status: string;
  error: null | string;
}

const initialState: OrderDetailsState = {
  orderDetails: {} as OrderType,
  status: 'idle',
  error: null,
};

export const fetchOrderDetails = createAsyncThunk(
  'orderDetails/fetchOrderDetails',
  async (args: FetchOrderDetailsArgs, { rejectWithValue }) => {
    const { id, token } = args;
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get(`/api/orders/${id}`, config);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.status = 'idle';
      state.orderDetails = {} as OrderType;
    },
  },
  extraReducers(builder) {
    builder
      // fetchOrderDetails
      .addCase(fetchOrderDetails.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orderDetails = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action: any) => {
        state.status = 'failed';
        if (action.payload.non_field_errors) {
          state.error = action.payload.non_field_errors;
        } else {
          state.error = action.error.message!;
        }
      });
  },
});

export default orderDetailsSlice.reducer;

export const { resetOrder } = orderDetailsSlice.actions;

export const selectOrderDetailsState = (state: RootState) => state.orderDetails;
