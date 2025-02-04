import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface WebSocketConfig {
  url: string;
  onMessage?: (event: MessageEvent) => void;
  onError?: (error: Event) => void;
}

export const useWebSocketConnection = ({ url, onMessage, onError }: WebSocketConfig) => {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 3;
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const isCleaningUpRef = useRef(false);

  const connect = useCallback(() => {
    if (isCleaningUpRef.current) {
      console.log('Skipping connection attempt during cleanup');
      return;
    }

    try {
      console.log('Attempting WebSocket connection to:', url);
      if (wsRef.current?.readyState === WebSocket.CONNECTING) {
        console.log('Connection already in progress, skipping');
        return;
      }

      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected successfully');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        toast.success('Connected to chat server');
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket connection closed');
        setIsConnected(false);
        
        if (!isCleaningUpRef.current && reconnectAttemptsRef.current < maxReconnectAttempts) {
          console.log(`Attempting reconnect ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts}`);
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            connect();
          }, 2000);
        } else if (!isCleaningUpRef.current) {
          console.log('Max reconnection attempts reached');
          toast.error('Unable to connect to chat server. Please refresh the page.');
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        onError?.(error);
      };

      wsRef.current.onmessage = (event) => {
        console.log('WebSocket message received:', event.data);
        onMessage?.(event);
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      toast.error('Failed to connect to chat server');
    }
  }, [url, onMessage, onError]);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('Sending WebSocket message:', message);
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected, message not sent:', message);
      toast.error('Not connected to chat server');
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      console.log('Cleaning up WebSocket connection');
      isCleaningUpRef.current = true;
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);

  return {
    isConnected,
    sendMessage,
  };
};