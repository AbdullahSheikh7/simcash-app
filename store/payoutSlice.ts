import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define types
interface Payout {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'completed' | 'processing';
  createdAt: string;
}

interface PayoutState {
  payouts: Payout[];
  isLoading: boolean;
  error: string | null;
  currentBalance: number;
}

interface CreatePayoutData {
  amount: number;
}

// Async thunks
export const fetchPayouts = createAsyncThunk(
  'payouts/fetchPayouts',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/payouts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch payouts');
    }
  }
);

export const createPayout = createAsyncThunk(
  'payouts/createPayout',
  async (payoutData: CreatePayoutData, { rejectWithValue, getState }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/payouts`, payoutData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create payout');
    }
  }
);

export const updatePayoutStatus = createAsyncThunk(
  'payouts/updatePayoutStatus',
  async ({ id, status }: { id: string; status: string }, { rejectWithValue, getState }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      
      const response = await axios.put(`${process.env.EXPO_PUBLIC_API_URL}/api/payouts/${id}/status`, 
        { status }, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update payout status');
    }
  }
);

// Initial state
const initialState: PayoutState = {
  payouts: [],
  isLoading: false,
  error: null,
  currentBalance: 0,
};

// Payout slice
const payoutSlice = createSlice({
  name: 'payouts',
  initialState,
  reducers: {
    setCurrentBalance: (state, action: PayloadAction<number>) => {
      state.currentBalance = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch payouts cases
      .addCase(fetchPayouts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPayouts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.payouts = action.payload;
        
        // Calculate current balance from completed payouts
        state.currentBalance = action.payload
          .filter((payout: Payout) => payout.status === 'completed')
          .reduce((sum: number, payout: Payout) => sum + payout.amount, 0);
      })
      .addCase(fetchPayouts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create payout cases
      .addCase(createPayout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPayout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.payouts.unshift(action.payload);
      })
      .addCase(createPayout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update payout status cases
      .addCase(updatePayoutStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePayoutStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.payouts.findIndex(payout => payout.id === action.payload.id);
        if (index !== -1) {
          state.payouts[index] = action.payload;
        }
      })
      .addCase(updatePayoutStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentBalance } = payoutSlice.actions;

export default payoutSlice.reducer;