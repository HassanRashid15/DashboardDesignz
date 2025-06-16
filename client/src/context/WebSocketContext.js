import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [subscriptions, setSubscriptions] = useState(new Set());
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000; // 3 seconds

  const connect = useCallback(() => {
    try {
      const socket = new WebSocket("ws://localhost:5000");

      socket.onopen = () => {
        console.log("WebSocket Connected");
        setIsConnected(true);
        setReconnectAttempts(0);
      };

      socket.onclose = () => {
        console.log("WebSocket Disconnected");
        setIsConnected(false);

        // Attempt to reconnect if we haven't exceeded max attempts
        if (reconnectAttempts < maxReconnectAttempts) {
          setTimeout(() => {
            setReconnectAttempts((prev) => prev + 1);
            connect();
          }, reconnectDelay);
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket Error:", error);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleMessage(data);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      setWs(socket);
    } catch (error) {
      console.error("Error creating WebSocket connection:", error);
    }
  }, [reconnectAttempts]);

  useEffect(() => {
    connect();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [connect]);

  const handleMessage = (data) => {
    // Handle different types of messages
    switch (data.type) {
      case "dashboard_update":
        // Handle dashboard updates
        break;
      case "notification":
        // Handle notifications
        break;
      case "task_update":
        // Handle task updates
        break;
      default:
        console.log("Unknown message type:", data.type);
    }
  };

  const subscribe = useCallback(
    (channel) => {
      if (ws && isConnected) {
        try {
          ws.send(JSON.stringify({ type: "subscribe", channel }));
          setSubscriptions((prev) => new Set([...prev, channel]));
        } catch (error) {
          console.error("Error subscribing to channel:", error);
        }
      }
    },
    [ws, isConnected]
  );

  const unsubscribe = useCallback(
    (channel) => {
      if (ws && isConnected) {
        try {
          ws.send(JSON.stringify({ type: "unsubscribe", channel }));
          setSubscriptions((prev) => {
            const newSubs = new Set(prev);
            newSubs.delete(channel);
            return newSubs;
          });
        } catch (error) {
          console.error("Error unsubscribing from channel:", error);
        }
      }
    },
    [ws, isConnected]
  );

  const value = {
    ws,
    isConnected,
    subscribe,
    unsubscribe,
    reconnectAttempts,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
