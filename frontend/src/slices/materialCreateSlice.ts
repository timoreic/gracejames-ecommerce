import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import type { MaterialType } from '../types/MaterialTypes';
import axios from 'axios';

interface MaterialCreateState {
  material: MaterialType;
  status: string;
  error: null | string;
}

const initialState: MaterialCreateState = {
  material: {} as MaterialType,
  status: 'idle',
  error: null,
};

export const createMaterial = createAsyncThunk(
  'material/createMaterial',
  async (token: string, { rejectWithValue }) => {
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.post(
        `/api/products/materials/create/`,
        {},
        config
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const MaterialCreateSlice = createSlice({
  name: 'createMaterial',
  initialState,
  reducers: {
    resetMaterialCreateState: (state) => {
      state.status = 'idle';
      state.material = {} as MaterialType;
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      // Create Material
      .addCase(createMaterial.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(createMaterial.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.material = action.payload;
      })
      .addCase(createMaterial.rejected, (state, action: any) => {
        state.status = 'failed';
        if (action.payload.non_field_errors) {
          state.error = action.payload.non_field_errors;
        } else {
          state.error = action.error.message!;
        }
      });
  },
});

export const { resetMaterialCreateState } = MaterialCreateSlice.actions;

export default MaterialCreateSlice.reducer;

export const selectMaterialCreateState = (state: RootState) =>
  state.materialCreate;
