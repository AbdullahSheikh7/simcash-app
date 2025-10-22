import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import simReducer from './simSlice';
import messageReducer from './messageSlice';
import payoutReducer from './payoutSlice';
import dashboardReducer from './dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sims: simReducer,
    messages: messageReducer,
    payouts: payoutReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types during serialization checks
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;