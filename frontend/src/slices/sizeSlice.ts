import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import type { RootState } from '../app/store';
import type { SizeType } from '../types/SizeTypes';

interface SizeState {
  sizeDetails: SizeType;
  status: string;
  error: null | string;
}

const initialState: SizeState = {
  sizeDetails: {} as SizeType,
  status: 'idle',
  error: null,
};

export const fetchSize = createAsyncThunk(
  'sizeDetails/fetchSize',
  async (id: string) => {
    const response = await axios.get(`/api/products/sizes/${id}/`);
    return response.data;
  }
);

export const sizeSlice = createSlice({
  name: 'size',
  initialState,
  reducers: {
    resetSizeState: (state) => {
      state.status = 'idle';
      state.sizeDetails = {} as SizeType;
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchSize.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchSize.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sizeDetails = action.payload;
      })
      .addCase(fetchSize.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message!;
      });
  },
});

export const { resetSizeState } = sizeSlice.actions;

export default sizeSlice.reducer;

export const selectSizeState = (state: RootState) => state.size;
