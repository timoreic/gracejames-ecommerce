import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import axios from 'axios';
import type { DeleteUserArgs } from '../types/UserTypes';

interface UserState {
  deleteUserResponse: string;
  status: string;
  error: null | string;
}

const initialState: UserState = {
  deleteUserResponse: '',
  status: 'idle',
  error: null,
};

export const deleteUser = createAsyncThunk(
  'deleteUserResponse/deleteUser',
  async (args: DeleteUserArgs, { rejectWithValue }) => {
    const { token, id } = args;
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.delete(`/api/users/delete/${id}/`, config);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const userDeleteSlice = createSlice({
  name: 'deleteUser',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Delete User
      .addCase(deleteUser.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.deleteUserResponse = action.payload;
      })
      .addCase(deleteUser.rejected, (state, action: any) => {
        state.status = 'failed';
        if (action.payload.non_field_errors) {
          state.error = action.payload.non_field_errors;
        } else {
          state.error = action.error.message!;
        }
      });
  },
});

export default userDeleteSlice.reducer;

export const selectUserDeleteState = (state: RootState) => state.userDelete;
