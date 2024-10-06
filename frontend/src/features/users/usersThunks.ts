import {createAsyncThunk} from '@reduxjs/toolkit';
import {GlobalError, LoginMutation, RegisterMutation, User, ValidationError} from '../../types';
import axiosApi from '../../axiosApi';
import {isAxiosError} from 'axios';
import {RootState} from '../../app/store';
import {unsetUser} from './usersSlice';

export const register = createAsyncThunk<User, RegisterMutation, { rejectValue: ValidationError }>(
  'users/register',
  async (registerMutation, {rejectWithValue}) => {
    try {
      const {data: user} = await axiosApi.post<User>('/users', registerMutation);
      return user;
    } catch (error) {
      if (isAxiosError(error) && error.response && error.response.status === 400) {
        return rejectWithValue(error.response.data);
      }

      throw error;
    }
  },
);

export const login = createAsyncThunk<User, LoginMutation, { rejectValue: GlobalError }>(
  'users/login',
  async (loginMutation, {rejectWithValue}) => {
    try {
      const {data: user} = await axiosApi.post<User>('/users/sessions', loginMutation);
      return user;
    } catch (error) {
      if (isAxiosError(error) && error.response && error.response.status === 400) {
        return rejectWithValue(error.response.data);
      }

      throw error;
    }
  }
);

export const logout = createAsyncThunk<void, void, {state: RootState}>(
  'users/logout', async (_arg, {getState, dispatch}) => {
    const token = getState().users.user?.token;

    if (!token) {
      return;
    }

    await axiosApi.delete('/users/sessions', {headers: {'Authorization': `Bearer ${token}`}});
    dispatch(unsetUser());
  });