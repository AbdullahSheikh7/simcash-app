import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { updateMetric } from '@/store/dashboardSlice';
import { addMessage } from '@/store/messageSlice';
import { setCurrentBalance } from '@/store/payoutSlice';

interface WebSocketContextType {
  isConnected: boolean;
  sendMessage: (message: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const dispatch = useDispatch();
  
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (!token) return;

    // Connect to WebSocket server
    // In a production environment, you would get this from an environment variable
    const wsUrl = `ws://localhost:3000`;
    console.log('Connecting to WebSocket:', wsUrl);

    const newWs = new WebSocket(wsUrl);

    newWs.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      // Send authentication token
      newWs.send(JSON.stringify({
        type: 'auth',
        token: token
      }));
    };

    newWs.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('Received WebSocket message:', message);

        // Handle different message types and update Redux state
        switch (message.type) {
          case 'sim_status_update':
            // Could dispatch an action to update SIM status in Redux
            console.log('SIM status updated:', message);
            break;
          case 'message_status_update':
            // Could dispatch an action to update message status in Redux
            console.log('Message status updated:', message);
            break;
          case 'new_message':
            // Dispatch action to add new message to Redux
            if (message.message) {
              dispatch(addMessage(message.message));
            }
            break;
          case 'payout_update':
            // Dispatch action to update payout status in Redux
            console.log('Payout updated:', message);
            break;
          case 'dashboard_update':
            // Dispatch action to update dashboard metrics in Redux
            if (message.metrics) {
              dispatch(updateMetric(message.metrics));
            }
            console.log('Dashboard metrics updated:', message);
            break;
          case 'welcome':
            console.log('WebSocket welcome message:', message);
            break;
          case 'error':
            console.error('WebSocket error message:', message);
            break;
          default:
            console.log('Unknown message type:', message.type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    newWs.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      setIsConnected(false);
    };

    newWs.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    setWs(newWs);

    // Cleanup function
    return () => {
      console.log('Closing WebSocket connection');
      if (newWs) {
        newWs.close();
      }
    };
  }, [token, dispatch]);

  const sendMessage = (message: any) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  };

  const value = {
    isConnected,
    sendMessage
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};