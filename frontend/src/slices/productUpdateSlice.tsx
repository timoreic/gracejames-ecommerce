import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import type { ProductType, UpdateProductArgs } from '../types/ProductTypes';
import axios from 'axios';

interface UpdateProductState {
  product: ProductType;
  status: string;
  error: null | string;
}

const initialState: UpdateProductState = {
  product: {} as ProductType,
  status: 'idle',
  error: null,
};

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async (args: UpdateProductArgs, { rejectWithValue }) => {
    const { product, token } = args;
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.put(
        `/api/products/update/${product._id}/`,
        product,
        config
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const productUpdateSlice = createSlice({
  name: 'updateProduct',
  initialState,
  reducers: {
    resetProductUpdateState: (state) => {
      state.status = 'idle';
      state.product = {} as ProductType;
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      // Update Product
      .addCase(updateProduct.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.product = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action: any) => {
        state.status = 'failed';
        if (action.payload.non_field_errors) {
          state.error = action.payload.non_field_errors;
        } else {
          state.error = action.error.message!;
        }
      });
  },
});

export const { resetProductUpdateState } = productUpdateSlice.actions;

export default productUpdateSlice.reducer;

export const selectProductUpdateState = (state: RootState) =>
  state.productUpdate;
