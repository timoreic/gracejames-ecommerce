import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import type { RootState } from '../app/store';
import type { DisplayType } from '../types/DisplayTypes';

interface DisplayState {
  displayDetails: DisplayType;
  status: string;
  error: null | string;
}

const initialState: DisplayState = {
  displayDetails: {} as DisplayType,
  status: 'idle',
  error: null,
};

export const fetchDisplay = createAsyncThunk(
  'displayDetails/fetchDisplay',
  async (id: string) => {
    const response = await axios.get(`/api/displays/${id}`);
    return response.data;
  }
);

export const displaySlice = createSlice({
  name: 'display',
  initialState,
  reducers: {
    resetDisplayState: (state) => {
      state.status = 'idle';
      state.displayDetails = {} as DisplayType;
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchDisplay.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchDisplay.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.displayDetails = action.payload;
      })
      .addCase(fetchDisplay.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message!;
      });
  },
});

export const { resetDisplayState } = displaySlice.actions;

export default displaySlice.reducer;

export const selectDisplayState = (state: RootState) => state.display;
