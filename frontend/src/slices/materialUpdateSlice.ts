import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import type { MaterialType, UpdateMaterialArgs } from '../types/MaterialTypes';
import axios from 'axios';

interface UpdateMaterialState {
  material: MaterialType;
  status: string;
  error: null | string;
}

const initialState: UpdateMaterialState = {
  material: {} as MaterialType,
  status: 'idle',
  error: null,
};

export const updateMaterial = createAsyncThunk(
  'material/updateMaterial',
  async (args: UpdateMaterialArgs, { rejectWithValue }) => {
    const { material, token } = args;
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.put(
        `/api/products/materials/update/${material._id}/`,
        material,
        config
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const materialUpdateSlice = createSlice({
  name: 'updateMaterial',
  initialState,
  reducers: {
    resetMaterialUpdateState: (state) => {
      state.status = 'idle';
      state.material = {} as MaterialType;
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      // Update Material
      .addCase(updateMaterial.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(updateMaterial.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.material = action.payload;
      })
      .addCase(updateMaterial.rejected, (state, action: any) => {
        state.status = 'failed';
        if (action.payload.non_field_errors) {
          state.error = action.payload.non_field_errors;
        } else {
          state.error = action.error.message!;
        }
      });
  },
});

export const { resetMaterialUpdateState } = materialUpdateSlice.actions;

export default materialUpdateSlice.reducer;

export const selectMaterialUpdateState = (state: RootState) =>
  state.materialUpdate;
