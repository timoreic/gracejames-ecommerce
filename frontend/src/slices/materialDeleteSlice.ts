import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import axios from 'axios';
import type { DeleteMaterialArgs } from '../types/MaterialTypes';

interface MaterialDeleteState {
  response: string;
  status: string;
  success: number;
  error: null | string;
}

const initialState: MaterialDeleteState = {
  response: '',
  status: 'idle',
  success: 0,
  error: null,
};

export const deleteMaterial = createAsyncThunk(
  'response/deleteMaterial',
  async (args: DeleteMaterialArgs, { rejectWithValue }) => {
    const { token, id } = args;
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.delete(
        `/api/products/materials/delete/${id}/`,
        config
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const MaterialDeleteSlice = createSlice({
  name: 'deleteMaterial',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Delete Material
      .addCase(deleteMaterial.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(deleteMaterial.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.success += 1;
        state.response = action.payload;
      })
      .addCase(deleteMaterial.rejected, (state, action: any) => {
        state.status = 'failed';
        if (action.payload.non_field_errors) {
          state.error = action.payload.non_field_errors;
        } else {
          state.error = action.error.message!;
        }
      });
  },
});

export default MaterialDeleteSlice.reducer;

export const selectMaterialDeleteState = (state: RootState) =>
  state.materialDelete;
