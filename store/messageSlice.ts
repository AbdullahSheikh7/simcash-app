import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define types
interface Message {
  id: string;
  simId: string;
  content: string;
  status: 'pending' | 'sent' | 'failed' | 'received';
  type: 'incoming' | 'outgoing';
  createdAt: string;
}

interface MessageState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  filters: {
    simId: string | null;
    status: string | null;
    type: string | null;
  };
}

interface CreateMessageData {
  simId: string;
  content: string;
  type?: 'incoming' | 'outgoing';
}

// Async thunks
export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (filters: { simId?: string; status?: string; type?: string } = {}, { rejectWithValue, getState }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      
      const params = new URLSearchParams();
      if (filters.simId) params.append('simId', filters.simId);
      if (filters.status) params.append('status', filters.status);
      if (filters.type) params.append('type', filters.type);
      
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/messages?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch messages');
    }
  }
);

export const createMessage = createAsyncThunk(
  'messages/createMessage',
  async (messageData: CreateMessageData, { rejectWithValue, getState }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/messages`, messageData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create message');
    }
  }
);

export const updateMessageStatus = createAsyncThunk(
  'messages/updateMessageStatus',
  async ({ id, status }: { id: string; status: string }, { rejectWithValue, getState }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      
      const response = await axios.put(`${process.env.EXPO_PUBLIC_API_URL}/api/messages/${id}`, 
        { status }, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update message');
    }
  }
);

// Initial state
const initialState: MessageState = {
  messages: [],
  isLoading: false,
  error: null,
  filters: {
    simId: null,
    status: null,
    type: null,
  },
};

// Message slice
const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Partial<MessageState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.unshift(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch messages cases
      .addCase(fetchMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create message cases
      .addCase(createMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages.unshift(action.payload);
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update message cases
      .addCase(updateMessageStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateMessageStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.messages.findIndex(msg => msg.id === action.payload.id);
        if (index !== -1) {
          state.messages[index] = action.payload;
        }
      })
      .addCase(updateMessageStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilter, clearMessages, addMessage } = messageSlice.actions;

export default messageSlice.reducer;