import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define types
interface SIM {
  id: string;
  carrier: string;
  country: string;
  phoneNumber: string;
  isOnline: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface SIMState {
  sims: SIM[];
  selectedSim: SIM | null;
  isLoading: boolean;
  error: string | null;
}

interface CreateSIMData {
  carrier: string;
  country: string;
  phoneNumber: string;
}

// Async thunks
export const fetchSims = createAsyncThunk(
  'sims/fetchSims',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/sims`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch SIMs');
    }
  }
);

export const createSIM = createAsyncThunk(
  'sims/createSIM',
  async (simData: CreateSIMData, { rejectWithValue, getState }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/sims`, simData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create SIM');
    }
  }
);

export const updateSIM = createAsyncThunk(
  'sims/updateSIM',
  async ({ id, ...simData }: { id: string } & Partial<CreateSIMData>, { rejectWithValue, getState }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      
      const response = await axios.put(`${process.env.EXPO_PUBLIC_API_URL}/api/sims/${id}`, simData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update SIM');
    }
  }
);

export const deleteSIM = createAsyncThunk(
  'sims/deleteSIM',
  async (id: string, { rejectWithValue, getState }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      
      await axios.delete(`${process.env.EXPO_PUBLIC_API_URL}/api/sims/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete SIM');
    }
  }
);

// Initial state
const initialState: SIMState = {
  sims: [],
  selectedSim: null,
  isLoading: false,
  error: null,
};

// SIM slice
const simSlice = createSlice({
  name: 'sims',
  initialState,
  reducers: {
    setSelectedSim: (state, action: PayloadAction<SIM | null>) => {
      state.selectedSim = action.payload;
    },
    clearSims: (state) => {
      state.sims = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch SIMs cases
      .addCase(fetchSims.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSims.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sims = action.payload;
      })
      .addCase(fetchSims.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create SIM cases
      .addCase(createSIM.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSIM.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sims.push(action.payload);
      })
      .addCase(createSIM.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update SIM cases
      .addCase(updateSIM.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSIM.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.sims.findIndex(sim => sim.id === action.payload.id);
        if (index !== -1) {
          state.sims[index] = action.payload;
        }
        if (state.selectedSim && state.selectedSim.id === action.payload.id) {
          state.selectedSim = action.payload;
        }
      })
      .addCase(updateSIM.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete SIM cases
      .addCase(deleteSIM.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSIM.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sims = state.sims.filter(sim => sim.id !== action.payload);
        if (state.selectedSim && state.selectedSim.id === action.payload) {
          state.selectedSim = null;
        }
      })
      .addCase(deleteSIM.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedSim, clearSims } = simSlice.actions;

export default simSlice.reducer;