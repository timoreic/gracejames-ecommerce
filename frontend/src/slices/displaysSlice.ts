import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import type { RootState } from '../app/store';
import type { DisplayType } from '../types/DisplayTypes';

interface DisplaysState {
  displays: DisplayType[];
  status: string;
  error: null | string;
}

const initialState: DisplaysState = {
  displays: [],
  status: 'idle',
  error: null,
};

export const fetchDisplays = createAsyncThunk(
  'displays/fetchDisplays',
  async () => {
    const response = await axios.get('/api/displays/');
    return response.data;
  }
);

export const displaysSlice = createSlice({
  name: 'displays',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchDisplays.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchDisplays.fulfilled, (state, action) => {
        state.displays = [];
        state.displays = state.displays.concat(action.payload);
        state.status = 'succeeded';
      })
      .addCase(fetchDisplays.rejected, (state, action) => {
        state.error = action.error.message!;
        state.status = 'failed';
      });
  },
});

export default displaysSlice.reducer;

export const selectDisplaysState = (state: RootState) => state.displays;
