import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define types
interface DashboardMetrics {
  activeSIMs: number;
  messagesToday: number;
  currentPayout: number;
  connectionStatus: string;
  totalMessages: number;
  recentMessages: Array<{
    id: string;
    content: string;
    status: string;
    type: string;
    createdAt: string;
  }>;
}

interface DashboardState {
  metrics: DashboardMetrics | null;
  isLoading: boolean;
  error: string | null;
}

// Async thunks
export const fetchDashboardMetrics = createAsyncThunk(
  'dashboard/fetchMetrics',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/dashboard/metrics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch dashboard metrics');
    }
  }
);

// Initial state
const initialState: DashboardState = {
  metrics: null,
  isLoading: false,
  error: null,
};

// Dashboard slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    updateMetric: (state, action: PayloadAction<Partial<DashboardMetrics>>) => {
      if (state.metrics) {
        state.metrics = { ...state.metrics, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch metrics cases
      .addCase(fetchDashboardMetrics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.metrics = action.payload;
      })
      .addCase(fetchDashboardMetrics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateMetric } = dashboardSlice.actions;

export default dashboardSlice.reducer;