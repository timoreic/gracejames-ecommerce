import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import type { RootState } from '../app/store';
import {
  UserUpdateArgs,
  UserInfoType,
  UserLoginArgs,
  UserRegisterArgs,
} from '../types/UserTypes';

interface UserState {
  userInfo: UserInfoType | null;
  status: string;
  error: null | string;
}

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo')!)
  : null;

const initialState: UserState = {
  userInfo: userInfoFromStorage,
  status: 'idle',
  error: null,
};

export const userLogin = createAsyncThunk(
  'userInfo/userLogin',
  async (args: UserLoginArgs, { rejectWithValue }) => {
    const { email, password } = args;
    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };
    try {
      const response = await axios.post(
        '/api/users/dj-rest-auth/login/',
        {
          email: email,
          password: password,
        },
        config
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const userRegister = createAsyncThunk(
  'userInfo/userRegister',
  async (args: UserRegisterArgs, { rejectWithValue }) => {
    const { email, first_name, last_name, password1, password2 } = args;
    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };
    try {
      const response = await axios.post(
        '/api/users/dj-rest-auth/registration/',
        {
          email: email,
          first_name: first_name,
          last_name: last_name,
          password1: password1,
          password2: password2,
        },
        config
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const userUpdate = createAsyncThunk(
  'userInfo/userUpdate',
  async (args: UserUpdateArgs, { rejectWithValue }) => {
    const { email, first_name, last_name, password1, password2, token } = args;
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.put(
        '/api/users/dj-rest-auth/user/',
        {
          email: email,
          first_name: first_name,
          last_name: last_name,
          password1: password1,
          password2: password2,
        },
        config
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('userInfo');
      state.userInfo = null;
    },
    resetError: (state) => {
      state.error = null;
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    },
  },
  extraReducers(builder) {
    builder
      // Register
      .addCase(userRegister.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(userRegister.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userInfo = action.payload;
        localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
      })
      .addCase(userRegister.rejected, (state, action: any) => {
        state.status = 'failed';
        if (action.payload.non_field_errors) {
          state.error = action.payload.non_field_errors;
        } else {
          state.error = action.error.message!;
        }
      })

      // Login
      .addCase(userLogin.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userInfo = action.payload;
        state.error = null;
        localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
      })
      .addCase(userLogin.rejected, (state, action: any) => {
        state.status = 'failed';
        if (action.payload.non_field_errors) {
          state.error = action.payload.non_field_errors;
        } else {
          state.error = action.error.message!;
        }
      })

      // Update
      .addCase(userUpdate.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(userUpdate.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userInfo!.user = action.payload;
        localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
      })
      .addCase(userUpdate.rejected, (state, action: any) => {
        state.status = 'failed';
        if (action.payload.non_field_errors) {
          state.error = action.payload.non_field_errors;
        } else {
          state.error = action.error.message!;
        }
      });
  },
});

export default userSlice.reducer;

export const { logout, resetError } = userSlice.actions;

export const selectUserState = (state: RootState) => state.user;
