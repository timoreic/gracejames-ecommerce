import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import type { ProductType } from '../types/ProductTypes';
import axios from 'axios';

interface ProductCreateState {
  product: ProductType;
  status: string;
  error: null | string;
}

const initialState: ProductCreateState = {
  product: {} as ProductType,
  status: 'idle',
  error: null,
};

export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (token: string, { rejectWithValue }) => {
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.post(`/api/products/create/`, {}, config);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const ProductCreateSlice = createSlice({
  name: 'createProduct',
  initialState,
  reducers: {
    resetProductCreateState: (state) => {
      state.status = 'idle';
      state.product = {} as ProductType;
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      // Create Product
      .addCase(createProduct.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.product = action.payload;
      })
      .addCase(createProduct.rejected, (state, action: any) => {
        state.status = 'failed';
        if (action.payload.non_field_errors) {
          state.error = action.payload.non_field_errors;
        } else {
          state.error = action.error.message!;
        }
      });
  },
});

export const { resetProductCreateState } = ProductCreateSlice.actions;

export default ProductCreateSlice.reducer;

export const selectProductCreateState = (state: RootState) =>
  state.productCreate;
