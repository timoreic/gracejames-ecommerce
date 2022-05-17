import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import type { RootState } from '../app/store';
import type { ProductType } from '../types/ProductTypes';

interface ProductState {
  productDetails: ProductType;
  status: string;
  error: null | string;
}

const initialState: ProductState = {
  productDetails: {} as ProductType,
  status: 'idle',
  error: null,
};

export const fetchProduct = createAsyncThunk(
  'productDetails/fetchProduct',
  async (id: string) => {
    const response = await axios.get(`/api/products/${id}`);
    return response.data;
  }
);

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    resetProductState: (state) => {
      state.status = 'idle';
      state.productDetails = {} as ProductType;
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProduct.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.productDetails = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message!;
      });
  },
});

export const { resetProductState } = productSlice.actions;

export default productSlice.reducer;

export const selectProductState = (state: RootState) => state.product;
