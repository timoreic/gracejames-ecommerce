import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import type { DisplayType } from '../types/DisplayTypes';
import axios from 'axios';

interface DisplayCreateState {
  display: DisplayType;
  status: string;
  error: null | string;
}

const initialState: DisplayCreateState = {
  display: {} as DisplayType,
  status: 'idle',
  error: null,
};

export const createDisplay = createAsyncThunk(
  'display/createDisplay',
  async (token: string, { rejectWithValue }) => {
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.post(`/api/displays/create/`, {}, config);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const DisplayCreateSlice = createSlice({
  name: 'createDisplay',
  initialState,
  reducers: {
    resetDisplayCreateState: (state) => {
      state.status = 'idle';
      state.display = {} as DisplayType;
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      // Create Display
      .addCase(createDisplay.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(createDisplay.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.display = action.payload;
      })
      .addCase(createDisplay.rejected, (state, action: any) => {
        state.status = 'failed';
        if (action.payload.non_field_errors) {
          state.error = action.payload.non_field_errors;
        } else {
          state.error = action.error.message!;
        }
      });
  },
});

export const { resetDisplayCreateState } = DisplayCreateSlice.actions;

export default DisplayCreateSlice.reducer;

export const selectDisplayCreateState = (state: RootState) =>
  state.displayCreate;
