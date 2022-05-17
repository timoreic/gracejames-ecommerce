import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import type { DisplayType, UpdateDisplayArgs } from '../types/DisplayTypes';
import axios from 'axios';

interface UpdateDisplayState {
  display: DisplayType;
  status: string;
  error: null | string;
}

const initialState: UpdateDisplayState = {
  display: {} as DisplayType,
  status: 'idle',
  error: null,
};

export const updateDisplay = createAsyncThunk(
  'display/updateDisplay',
  async (args: UpdateDisplayArgs, { rejectWithValue }) => {
    const { display, token } = args;
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.put(
        `/api/displays/update/${display._id}/`,
        display,
        config
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const displayUpdateSlice = createSlice({
  name: 'updateDisplay',
  initialState,
  reducers: {
    resetDisplayUpdateState: (state) => {
      state.status = 'idle';
      state.display = {} as DisplayType;
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      // Update Display
      .addCase(updateDisplay.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(updateDisplay.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.display = action.payload;
      })
      .addCase(updateDisplay.rejected, (state, action: any) => {
        state.status = 'failed';
        if (action.payload.non_field_errors) {
          state.error = action.payload.non_field_errors;
        } else {
          state.error = action.error.message!;
        }
      });
  },
});

export const { resetDisplayUpdateState } = displayUpdateSlice.actions;

export default displayUpdateSlice.reducer;

export const selectDisplayUpdateState = (state: RootState) =>
  state.displayUpdate;
