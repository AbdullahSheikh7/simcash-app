import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

interface WebSocketHook {
  sendMessage: (message: WebSocketMessage) => void;
  isConnected: boolean;
  lastMessage: WebSocketMessage | null;
}

const useWebSocket = (token: string | null): WebSocketHook => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const tokenRef = useRef(token);

  // Update token ref when token changes
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  useEffect(() => {
    if (!token) {
      console.log('No token available, cannot connect to WebSocket');
      return;
    }

    // Connect to WebSocket server
    const wsUrl = `ws://localhost:3000`; // In production, use environment variable
    console.log('Connecting to WebSocket:', wsUrl);

    const ws = new WebSocket(wsUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);

      // Send initial subscription message
      ws.send(JSON.stringify({
        type: 'subscribe',
        channel: 'dashboard'
      }));
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('Received WebSocket message:', message);
        setLastMessage(message);

        // Handle different message types
        switch (message.type) {
          case 'sim_status_update':
            // Dispatch action to update SIM status in Redux
            // This would be handled by a Redux action in a real implementation
            console.log('SIM status updated:', message);
            break;
          case 'message_status_update':
            // Dispatch action to update message status in Redux
            console.log('Message status updated:', message);
            break;
          case 'new_message':
            // Dispatch action to add new message to Redux
            console.log('New message received:', message);
            break;
          case 'payout_update':
            // Dispatch action to update payout status in Redux
            console.log('Payout updated:', message);
            break;
          case 'dashboard_update':
            // Dispatch action to update dashboard metrics in Redux
            console.log('Dashboard metrics updated:', message);
            break;
          default:
            console.log('Unknown message type:', message.type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    // Cleanup function
    return () => {
      console.log('Closing WebSocket connection');
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [token]);

  const sendMessage = (message: WebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  };

  return {
    sendMessage,
    isConnected,
    lastMessage
  };
};

export default useWebSocket;