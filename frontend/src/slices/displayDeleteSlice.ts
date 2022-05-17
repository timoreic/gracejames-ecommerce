import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import axios from 'axios';
import type { DeleteDisplayArgs } from '../types/DisplayTypes';

interface DisplayDeleteState {
  deleteDisplayResponse: string;
  status: string;
  success: number;
  error: null | string;
}

const initialState: DisplayDeleteState = {
  deleteDisplayResponse: '',
  status: 'idle',
  success: 0,
  error: null,
};

export const deleteDisplay = createAsyncThunk(
  'deleteDisplayResponse/deleteDisplay',
  async (args: DeleteDisplayArgs, { rejectWithValue }) => {
    const { token, id } = args;
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.delete(
        `/api/displays/delete/${id}/`,
        config
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const DisplayDeleteSlice = createSlice({
  name: 'deleteDisplay',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Delete Display
      .addCase(deleteDisplay.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(deleteDisplay.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.success += 1;
        state.deleteDisplayResponse = action.payload;
      })
      .addCase(deleteDisplay.rejected, (state, action: any) => {
        state.status = 'failed';
        if (action.payload.non_field_errors) {
          state.error = action.payload.non_field_errors;
        } else {
          state.error = action.error.message!;
        }
      });
  },
});

export default DisplayDeleteSlice.reducer;

export const selectDisplayDeleteState = (state: RootState) =>
  state.displayDelete;
