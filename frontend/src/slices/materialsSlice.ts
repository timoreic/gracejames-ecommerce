import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import type { RootState } from '../app/store';
import type { MaterialType } from '../types/MaterialTypes';

interface MaterialsState {
  materials: MaterialType[];
  status: string;
  error: null | string;
}

const initialState: MaterialsState = {
  materials: [],
  status: 'idle',
  error: null,
};

export const fetchMaterials = createAsyncThunk(
  'materials/fetchMaterials',
  async () => {
    const response = await axios.get('/api/products/materials/');
    return response.data;
  }
);

export const materialsSlice = createSlice({
  name: 'materials',
  initialState,
  reducers: {
    resetMaterialsState: (state) => {
      state.status = 'idle';
      state.error = null;
      state.materials = [];
    },
  },
  extraReducers(builder) {
    builder
      // fetchMaterials
      .addCase(fetchMaterials.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchMaterials.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.materials = action.payload;
      })
      .addCase(fetchMaterials.rejected, (state, action: any) => {
        state.status = 'failed';
        if (action.payload.non_field_errors) {
          state.error = action.payload.non_field_errors;
        } else {
          state.error = action.error.message!;
        }
      });
  },
});

export default materialsSlice.reducer;

export const { resetMaterialsState } = materialsSlice.actions;

export const selectMaterialsState = (state: RootState) => state.materials;
