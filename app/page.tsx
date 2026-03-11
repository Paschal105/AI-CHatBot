'use client';

import { useState } from 'react';

// TypeScript type for messages
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  // State to store all chat messages
  const [messages, setMessages] = useState<Message[]>([]);
  
  // State to store what user is typing
  const [input, setInput] = useState('');
  
  // State to show "typing..." indicator
  const [loading, setLoading] = useState(false);

  // Function that runs when user sends a message
  const sendMessage = async () => {
    // Don't send empty messages
    if (!input.trim()) return;

    // Add user's message to the chat
    const userMessage: Message = { 
      role: 'user', 
      content: input 
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Clear the input box
    setInput('');
    
    // Show "typing..." indicator
    setLoading(true);

    try {
      // Call our API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      // Add AI's response to the chat
      const aiMessage: Message = { 
        role: 'assistant', 
        content: data.message 
      };
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Error:', error);
      
      // Show error message in chat
      const errorMessage: Message = { 
        role: 'assistant', 
        content: 'Sorry, something went wrong. Please try again.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      // Hide "typing..." indicator
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header Section */}
        <div className="bg-white rounded-t-2xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-amber-900">
            ☕ Boston Brew Coffee
          </h1>
          <p className="text-gray-600 mt-2">
            Chat with our AI assistant
          </p>
        </div>

        {/* Chat Messages Area */}
        <div className="bg-white p-6 h-96 overflow-y-auto border-x border-gray-200">
          
          {/* Welcome message (shows when no messages yet) */}
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-20">
              <p className="text-lg">
                👋 Hi! Ask me anything about Boston Brew!
              </p>
              <p className="text-sm mt-2">
                Try: "What are your hours?" or "What's on the menu?"
              </p>
            </div>
          )}

          {/* Display all messages */}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 ${
                msg.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block px-4 py-2 rounded-2xl max-w-xs ${
                  msg.role === 'user'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* "Typing..." indicator */}
          {loading && (
            <div className="text-left mb-4">
              <div className="inline-block px-4 py-2 rounded-2xl bg-gray-100 text-gray-500">
                Typing...
              </div>
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-b-2xl p-4 shadow-lg">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  sendMessage();
                }
              }}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-amber-500 text-gray-900"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-amber-600 text-white rounded-full hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
