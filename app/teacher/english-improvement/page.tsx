"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, Square } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/hooks/useLanguage"
import { useAuthContext } from "@/components/providers/AuthProvider"
import { LayoutWrapper } from "@/components/common/LayoutWrapper"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { getWebSocketUrl, WS_ENDPOINTS } from "@/lib/config"

interface ChatMessage {
  sender: string;
  text: string;
  type: string;
}

const EnglishImprovementPage = () => {
  const { currentLanguage } = useLanguage()
  const { user, userProfile } = useAuthContext()
  
  const [name, setName] = useState('YourName');
  const [language, setLanguage] = useState('English');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  // Get user name
  const getUserName = () => {
    if (userProfile?.displayName) return userProfile.displayName
    if (user?.email) return user.email.split('@')[0]
    return "User"
  }

  const connectWebSocket = () => {
    if (ws.current) ws.current.close(); // Cleanup old socket

    console.log('Attempting to connect to WebSocket...');
    const wsUrl = getWebSocketUrl(WS_ENDPOINTS.ECA_AGENT);
    console.log('WebSocket URL:', wsUrl);
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('✅ WebSocket connected successfully!');
      console.log('Sending initial message:', { 
        name: getUserName(), 
        language: currentLanguage 
      });
      // Send initial connection message with name and language
      ws.current!.send(JSON.stringify({ 
        name: getUserName(), 
        language: currentLanguage 
      }));
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      console.log('📨 Received WebSocket message:', event.data);
      try {
        const data = JSON.parse(event.data);
        if (data.user) appendMessage('You', data.user, 'user');
        if (data.bot) appendMessage('Sahayak', data.bot, 'bot');
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.current.onerror = (err) => {
      console.error('❌ WebSocket error:', err);
      setIsConnected(false);
    };

    ws.current.onclose = (event) => {
      console.log('🔌 WebSocket connection closed:', event.code, event.reason);
      setIsConnected(false);
    };
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    const userMessage = message.trim();
    setMessage('');
    
    // Add user message to chat immediately
    appendMessage('You', userMessage, 'user');
    
    // If not connected, establish connection first
    if (!isConnected) {
      connectWebSocket();
      
      // Wait for connection to establish, then send message
      setTimeout(async () => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          console.log('📤 Sending message via WebSocket:', { user: userMessage });
          ws.current.send(JSON.stringify({ user: userMessage }));
        } else {
          console.log('⚠️ WebSocket not connected, falling back to API...');
          // Fallback to API if WebSocket fails
          await sendMessageViaAPI(userMessage);
        }
      }, 1000);
    } else {
      // Already connected, send message immediately
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        console.log('📤 Sending message via WebSocket:', { user: userMessage });
        ws.current.send(JSON.stringify({ user: userMessage }));
      } else {
        console.log('⚠️ WebSocket connection lost, falling back to API...');
        // Fallback to API if WebSocket fails
        await sendMessageViaAPI(userMessage);
      }
    }
  };

  const sendMessageViaAPI = async (userMessage: string) => {
    try {
      console.log('📡 Sending message via API...');
      const response = await fetch('/api/english-communication', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          userName: getUserName(),
          language: currentLanguage,
          conversationHistory: messages.map(msg => ({
            sender: msg.sender,
            text: msg.text
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ API response received');
        appendMessage('Sahayak', data.data.response, 'bot');
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('❌ API error:', error);
      appendMessage('System', 'Sorry, I encountered an error. Please try again.', 'error');
    }
  };

  const appendMessage = (sender: string, text: string, type: string = '') => {
    setMessages((prev) => [...prev, { sender, text, type }]);
  };

  const disconnectWebSocket = () => {
    if (ws.current) {
      console.log('🔌 Manually closing WebSocket connection...');
      ws.current.close();
      setIsConnected(false);
      appendMessage('System', 'WebSocket connection closed.', 'system');
    }
  };

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  return (
    <ProtectedRoute>
      <LayoutWrapper
        title="English Communication Improvement"
        subtitle="AI-Powered English Speaking Assistant"
        showLoginButton={true}
        logoHref="/"
        className="bg-white min-h-screen"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Chat Container */}
            <div className="bg-white rounded-2xl border-2 border-primary shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
              
              {/* Welcome Message */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-primary mb-2">
                  Hi {getUserName()}! 👋
                </h2>
                <p className="text-gray-600">
                  Start chatting with Sahayak to improve your English
                </p>
              </div>

              {/* Messages */}
              <div className="h-96 overflow-y-auto mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-4">🎤</div>
                    <p>Start your conversation with Sahayak</p>
                    <p className="text-sm mt-2">Type a message to begin</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-3 rounded-2xl ${
                            msg.type === 'user'
                              ? 'bg-primary text-white'
                              : msg.type === 'bot'
                              ? 'bg-white text-gray-800 border border-gray-300 shadow-sm'
                              : msg.type === 'system'
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="flex items-center space-x-3">
                <div className="flex-1 flex items-center bg-white rounded-full border-2 border-gray-300 focus-within:border-primary px-4 py-2 transition-colors">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 bg-transparent text-gray-800 placeholder-gray-500 outline-none"
                  />
                  <Button
                    size="sm"
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    className="ml-2 bg-primary hover:bg-primary/90"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                {isConnected && (
                  <Button
                    size="sm"
                    onClick={disconnectWebSocket}
                    variant="destructive"
                    className="bg-red-500 hover:bg-red-600"
                    title="Stop WebSocket Connection"
                  >
                    <Square className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </LayoutWrapper>
    </ProtectedRoute>
  );
};

export default EnglishImprovementPage;