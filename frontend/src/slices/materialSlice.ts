import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import type { RootState } from '../app/store';
import type { MaterialType } from '../types/MaterialTypes';

interface MaterialState {
  materialDetails: MaterialType;
  status: string;
  error: null | string;
}

const initialState: MaterialState = {
  materialDetails: {} as MaterialType,
  status: 'idle',
  error: null,
};

export const fetchMaterial = createAsyncThunk(
  'materialDetails/fetchMaterial',
  async (id: string) => {
    const response = await axios.get(`/api/products/materials/${id}/`);
    return response.data;
  }
);

export const materialSlice = createSlice({
  name: 'material',
  initialState,
  reducers: {
    resetMaterialState: (state) => {
      state.status = 'idle';
      state.materialDetails = {} as MaterialType;
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchMaterial.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchMaterial.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.materialDetails = action.payload;
      })
      .addCase(fetchMaterial.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message!;
      });
  },
});

export const { resetMaterialState } = materialSlice.actions;

export default materialSlice.reducer;

export const selectMaterialState = (state: RootState) => state.material;
