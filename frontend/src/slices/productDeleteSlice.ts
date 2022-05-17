import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import axios from 'axios';
import type { DeleteProductArgs } from '../types/ProductTypes';

interface ProductDeleteState {
  deleteProductResponse: string;
  status: string;
  success: number;
  error: null | string;
}

const initialState: ProductDeleteState = {
  deleteProductResponse: '',
  status: 'idle',
  success: 0,
  error: null,
};

export const deleteProduct = createAsyncThunk(
  'deleteProductResponse/deleteProduct',
  async (args: DeleteProductArgs, { rejectWithValue }) => {
    const { token, id } = args;
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.delete(
        `/api/products/delete/${id}/`,
        config
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const ProductDeleteSlice = createSlice({
  name: 'deleteProduct',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Delete Product
      .addCase(deleteProduct.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.success += 1;
        state.deleteProductResponse = action.payload;
      })
      .addCase(deleteProduct.rejected, (state, action: any) => {
        state.status = 'failed';
        if (action.payload.non_field_errors) {
          state.error = action.payload.non_field_errors;
        } else {
          state.error = action.error.message!;
        }
      });
  },
});

export default ProductDeleteSlice.reducer;

export const selectProductDeleteState = (state: RootState) =>
  state.productDelete;
