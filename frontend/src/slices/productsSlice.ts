import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import type { RootState } from '../app/store';
import type { ProductType } from '../types/ProductTypes';

interface ProductsState {
  productList: ProductType[];
  status: string;
  error: null | string;
}

const initialState: ProductsState = {
  productList: [],
  status: 'idle',
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'productList/fetchProducts',
  async () => {
    const response = await axios.get('/api/products/');
    return response.data;
  }
);

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.productList = [];
        state.productList = state.productList.concat(action.payload);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message!;
      });
  },
});

export default productsSlice.reducer;

export const selectProductsState = (state: RootState) => state.products;
