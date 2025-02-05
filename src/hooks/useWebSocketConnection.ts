import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface WebSocketConfig {
  url: string;
  onMessage?: (event: MessageEvent) => void;
  onError?: (error: Event) => void;
}

export const useWebSocketConnection = ({ url, onMessage, onError }: WebSocketConfig) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 3;
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const isCleaningUpRef = useRef(false);
  const hasInitializedRef = useRef(false);

  const handleConnectionError = useCallback((error: Event) => {
    console.error('[WebSocket] Connection error:', error);
    setConnectionError('Failed to establish connection');
    setIsConnected(false);
    toast.error('Connection error occurred. Attempting to reconnect...');
    onError?.(error);
  }, [onError]);

  const connect = useCallback(() => {
    if (isCleaningUpRef.current || hasInitializedRef.current) {
      console.log('[WebSocket] Skipping connection attempt');
      return;
    }

    try {
      setConnectionError(null);
      console.log('[WebSocket] Attempting connection to:', url);
      
      if (wsRef.current?.readyState === WebSocket.CONNECTING) {
        console.log('[WebSocket] Connection already in progress');
        return;
      }

      if (wsRef.current) {
        console.log('[WebSocket] Closing existing connection');
        wsRef.current.close();
        wsRef.current = null;
      }

      const ws = new WebSocket(url);
      wsRef.current = ws;
      hasInitializedRef.current = true;

      ws.onopen = () => {
        console.log('[WebSocket] Connected successfully');
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttemptsRef.current = 0;
        toast.success('Connected to chat server');
      };

      ws.onclose = (event) => {
        console.log('[WebSocket] Connection closed', event);
        setIsConnected(false);
        hasInitializedRef.current = false;
        
        if (!event.wasClean && !isCleaningUpRef.current && reconnectAttemptsRef.current < maxReconnectAttempts) {
          console.log(`[WebSocket] Attempting reconnect ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts}`);
          
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          
          const backoffTime = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            connect();
          }, backoffTime);
        } else if (!isCleaningUpRef.current) {
          console.log('[WebSocket] Max reconnection attempts reached');
          setConnectionError('Unable to establish a stable connection');
          toast.error('Unable to connect to chat server. Please refresh the page.');
        }
      };

      ws.onerror = handleConnectionError;
      ws.onmessage = onMessage || (() => {});
    } catch (error) {
      console.error('[WebSocket] Error creating connection:', error);
      setConnectionError('Failed to create connection');
      toast.error('Failed to connect to chat server');
    }
  }, [url, onMessage, handleConnectionError]);

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
      hasInitializedRef.current = false;
      
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
    connectionError,
    sendMessage,
  };
};