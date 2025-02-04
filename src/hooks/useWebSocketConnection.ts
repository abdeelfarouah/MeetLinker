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
      console.log('[WebSocket] Skipping connection attempt during cleanup');
      return;
    }

    try {
      console.log('[WebSocket] Attempting connection to:', url);
      
      // Prevent multiple connection attempts
      if (wsRef.current?.readyState === WebSocket.CONNECTING) {
        console.log('[WebSocket] Connection already in progress');
        return;
      }

      // Close existing connection if any
      if (wsRef.current) {
        console.log('[WebSocket] Closing existing connection');
        wsRef.current.close();
      }

      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        console.log('[WebSocket] Connected successfully');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        toast.success('Connected to chat server');
      };

      wsRef.current.onclose = (event) => {
        console.log('[WebSocket] Connection closed', event);
        setIsConnected(false);
        
        if (!isCleaningUpRef.current && reconnectAttemptsRef.current < maxReconnectAttempts) {
          console.log(`[WebSocket] Attempting reconnect ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts}`);
          
          // Clear any existing reconnect timeout
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            connect();
          }, 2000 * Math.pow(2, reconnectAttemptsRef.current)); // Exponential backoff
        } else if (!isCleaningUpRef.current) {
          console.log('[WebSocket] Max reconnection attempts reached');
          toast.error('Unable to connect to chat server. Please refresh the page.');
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
        toast.error('Connection error occurred');
        onError?.(error);
      };

      wsRef.current.onmessage = (event) => {
        console.log('[WebSocket] Message received:', event.data);
        onMessage?.(event);
      };
    } catch (error) {
      console.error('[WebSocket] Error creating connection:', error);
      toast.error('Failed to connect to chat server');
    }
  }, [url, onMessage, onError]);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('[WebSocket] Sending message:', message);
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('[WebSocket] Cannot send message - not connected:', message);
      toast.error('Not connected to chat server');
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      console.log('[WebSocket] Cleaning up connection');
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