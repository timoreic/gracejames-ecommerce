import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import type { SizeType, UpdateSizeArgs } from '../types/SizeTypes';
import axios from 'axios';

interface UpdateSizeState {
  size: SizeType;
  status: string;
  error: null | string;
}

const initialState: UpdateSizeState = {
  size: {} as SizeType,
  status: 'idle',
  error: null,
};

export const updateSize = createAsyncThunk(
  'size/updateSize',
  async (args: UpdateSizeArgs, { rejectWithValue }) => {
    const { size, token } = args;
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.put(
        `/api/products/sizes/update/${size._id}/`,
        size,
        config
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const sizeUpdateSlice = createSlice({
  name: 'updateSize',
  initialState,
  reducers: {
    resetSizeUpdateState: (state) => {
      state.status = 'idle';
      state.size = {} as SizeType;
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      // Update Size
      .addCase(updateSize.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(updateSize.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.size = action.payload;
      })
      .addCase(updateSize.rejected, (state, action: any) => {
        state.status = 'failed';
        if (action.payload.non_field_errors) {
          state.error = action.payload.non_field_errors;
        } else {
          state.error = action.error.message!;
        }
      });
  },
});

export const { resetSizeUpdateState } = sizeUpdateSlice.actions;

export default sizeUpdateSlice.reducer;

export const selectSizeUpdateState = (state: RootState) => state.sizeUpdate;
