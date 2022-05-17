import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import type { RootState } from '../app/store';
import type { SizeType } from '../types/SizeTypes';

interface SizesState {
  sizes: SizeType[];
  status: string;
  error: null | string;
}

const initialState: SizesState = {
  sizes: [],
  status: 'idle',
  error: null,
};

export const fetchSizes = createAsyncThunk('sizes/fetchSizes', async () => {
  const response = await axios.get('/api/products/sizes/');
  return response.data;
});

export const sizesSlice = createSlice({
  name: 'sizes',
  initialState,
  reducers: {
    resetSizesState: (state) => {
      state.status = 'idle';
      state.error = null;
      state.sizes = [];
    },
  },
  extraReducers(builder) {
    builder
      // fetchSizes
      .addCase(fetchSizes.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchSizes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sizes = action.payload;
      })
      .addCase(fetchSizes.rejected, (state, action: any) => {
        state.status = 'failed';
        if (action.payload.non_field_errors) {
          state.error = action.payload.non_field_errors;
        } else {
          state.error = action.error.message!;
        }
      });
  },
});

export default sizesSlice.reducer;

export const { resetSizesState } = sizesSlice.actions;

export const selectSizesState = (state: RootState) => state.sizes;
