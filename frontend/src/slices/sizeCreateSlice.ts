import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import type { SizeType } from '../types/SizeTypes';
import axios from 'axios';

interface SizeCreateState {
  size: SizeType;
  status: string;
  error: null | string;
}

const initialState: SizeCreateState = {
  size: {} as SizeType,
  status: 'idle',
  error: null,
};

export const createSize = createAsyncThunk(
  'size/createSize',
  async (token: string, { rejectWithValue }) => {
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.post(
        `/api/products/sizes/create/`,
        {},
        config
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const SizeCreateSlice = createSlice({
  name: 'createSize',
  initialState,
  reducers: {
    resetSizeCreateState: (state) => {
      state.status = 'idle';
      state.size = {} as SizeType;
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      // Create Size
      .addCase(createSize.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(createSize.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.size = action.payload;
      })
      .addCase(createSize.rejected, (state, action: any) => {
        state.status = 'failed';
        if (action.payload.non_field_errors) {
          state.error = action.payload.non_field_errors;
        } else {
          state.error = action.error.message!;
        }
      });
  },
});

export const { resetSizeCreateState } = SizeCreateSlice.actions;

export default SizeCreateSlice.reducer;

export const selectSizeCreateState = (state: RootState) => state.sizeCreate;
