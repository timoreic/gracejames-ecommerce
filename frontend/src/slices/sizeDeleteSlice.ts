import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import axios from 'axios';
import type { DeleteSizeArgs } from '../types/SizeTypes';

interface SizeDeleteState {
  response: string;
  status: string;
  success: number;
  error: null | string;
}

const initialState: SizeDeleteState = {
  response: '',
  status: 'idle',
  success: 0,
  error: null,
};

export const deleteSize = createAsyncThunk(
  'response/deleteSize',
  async (args: DeleteSizeArgs, { rejectWithValue }) => {
    const { token, id } = args;
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.delete(
        `/api/products/sizes/delete/${id}/`,
        config
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const SizeDeleteSlice = createSlice({
  name: 'deleteSize',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Delete Size
      .addCase(deleteSize.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(deleteSize.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.success += 1;
        state.response = action.payload;
      })
      .addCase(deleteSize.rejected, (state, action: any) => {
        state.status = 'failed';
        if (action.payload.non_field_errors) {
          state.error = action.payload.non_field_errors;
        } else {
          state.error = action.error.message!;
        }
      });
  },
});

export default SizeDeleteSlice.reducer;

export const selectSizeDeleteState = (state: RootState) => state.sizeDelete;
