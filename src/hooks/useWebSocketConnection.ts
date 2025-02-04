import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_INTERVAL = 3000;

interface WebSocketConfig {
  url: string;
  onMessage?: (event: MessageEvent) => void;
  onError?: (error: Event) => void;
}

export const useWebSocketConnection = ({ url, onMessage, onError }: WebSocketConfig) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const connect = useCallback(() => {
    try {
      const socket = new WebSocket(url);
      
      socket.onopen = () => {
        console.log('WebSocket connected successfully');
        setIsConnected(true);
        setReconnectAttempts(0);
        toast.success('Connexion établie');
      };

      socket.onclose = () => {
        console.log('WebSocket connection closed');
        setIsConnected(false);
        
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          setTimeout(() => {
            console.log(`Tentative de reconnexion ${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS}`);
            setReconnectAttempts(prev => prev + 1);
            connect();
          }, RECONNECT_INTERVAL);
        } else {
          toast.error('La connexion a été perdue. Veuillez rafraîchir la page.');
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (onError) onError(error);
        toast.error('Erreur de connexion');
      };

      socket.onmessage = (event) => {
        if (onMessage) onMessage(event);
      };

      setWs(socket);
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      toast.error('Impossible d\'établir la connexion');
    }
  }, [url, onMessage, onError, reconnectAttempts]);

  useEffect(() => {
    connect();
    
    return () => {
      if (ws) {
        console.log('Cleaning up WebSocket connection');
        ws.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((message: string | object) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(typeof message === 'string' ? message : JSON.stringify(message));
      } catch (error) {
        console.error('Error sending message:', error);
        toast.error('Erreur lors de l\'envoi du message');
      }
    } else {
      console.warn('WebSocket is not connected');
      toast.error('La connexion n\'est pas établie');
    }
  }, [ws]);

  return {
    isConnected,
    sendMessage,
    reconnectAttempts
  };
};