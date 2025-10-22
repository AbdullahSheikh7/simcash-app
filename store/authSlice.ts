import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define types
interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
}

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/login`, {
        email,
        password,
      });
      // Store token in local storage
      if (response.data.token) {
        // In React Native, we'd use AsyncStorage instead of localStorage
        // AsyncStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password }: RegisterData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/register`, {
        email,
        password,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Registration failed');
    }
  }
);

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      // In React Native, clear token from AsyncStorage
      // AsyncStorage.removeItem('token');
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register cases
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;

export default authSlice.reducer;