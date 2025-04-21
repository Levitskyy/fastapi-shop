'use client'
import React, { useEffect, useState } from "react";

const Notifications = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/api/purchases/notifications");
    console.log('connected');

    ws.onmessage = (event) => {
      setMessages(prev => [...prev, event.data ]);
    };

    return () => ws.close();
  }, []);

  return (
    <div className="fixed bottom-0 right-0 max-h-1/6 overflow-y-scroll">
      <h4>Уведомления</h4>
      {messages.map((msg, idx) => (
        <div key={idx} style={{ marginBottom: "0.5rem" }}>{msg}</div>
      ))}
    </div>
  );
};

export default Notifications;