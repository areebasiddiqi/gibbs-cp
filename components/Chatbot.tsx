"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Hello! I'm your Gibbs' Reflective Cycle assistant. How can I help you with your reflection today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, { role: "user", content: userMessage }],
                }),
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            {/* Chat Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`chatbot-toggle ${isOpen ? "active" : ""}`}
                aria-label="Toggle chat"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-window glass-card">
                    <div className="chatbot-header">
                        <div className="chatbot-header-info">
                            <div className="chatbot-avatar">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h3>Gibbs Assistant</h3>
                                <span className="status-online">Online</span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="close-btn">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((m, i) => (
                            <div key={i} className={`message-wrapper ${m.role}`}>
                                <div className="message-avatar">
                                    {m.role === "user" ? <User size={16} /> : <Bot size={16} />}
                                </div>
                                <div className="message-content">
                                    {m.role === "assistant" ? (
                                        <div className="markdown-content">
                                            <ReactMarkdown>{m.content}</ReactMarkdown>
                                        </div>
                                    ) : (
                                        <p>{m.content}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message-wrapper assistant">
                                <div className="message-avatar">
                                    <Bot size={16} />
                                </div>
                                <div className="message-content loading">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSubmit} className="chatbot-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about Gibbs' Cycle..."
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !input.trim()}>
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}

            <style jsx>{`
        .chatbot-container {
          position: fixed;
          bottom: var(--space-6);
          right: var(--space-6);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: var(--space-4);
        }

        .chatbot-toggle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%);
          color: white;
          border: none;
          box-shadow: var(--shadow-xl);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-bounce);
        }

        .chatbot-toggle:hover {
          transform: scale(1.1);
          box-shadow: var(--shadow-glow);
        }

        .chatbot-toggle.active {
          transform: rotate(90deg);
        }

        .chatbot-window {
          width: 380px;
          height: 500px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideInUp 0.4s var(--transition-bounce);
          border: 1px solid var(--glass-border);
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .chatbot-header {
          padding: var(--space-4);
          background: linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chatbot-header-info {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .chatbot-avatar {
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chatbot-header h3 {
          font-size: 1rem;
          margin: 0;
          color: white;
        }

        .status-online {
          font-size: 0.75rem;
          opacity: 0.9;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .status-online::before {
          content: "";
          width: 8px;
          height: 8px;
          background: #4ade80;
          border-radius: 50%;
          display: inline-block;
        }

        .close-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          opacity: 0.8;
          transition: opacity 0.2s;
        }

        .close-btn:hover {
          opacity: 1;
        }

        .chatbot-messages {
          flex: 1;
          padding: var(--space-4);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          background: rgba(255, 255, 255, 0.5);
        }

        .message-wrapper {
          display: flex;
          gap: var(--space-3);
          max-width: 85%;
        }

        .message-wrapper.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--gray-100);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--gray-500);
        }

        .user .message-avatar {
          background: var(--primary-100);
          color: var(--primary-600);
        }

        .message-content {
          padding: var(--space-3);
          border-radius: var(--radius-lg);
          font-size: 0.9375rem;
          line-height: 1.5;
        }

        .assistant .message-content {
          background: white;
          color: var(--gray-800);
          border-bottom-left-radius: 0;
          box-shadow: var(--shadow-sm);
        }

        .user .message-content {
          background: var(--primary-500);
          color: white;
          border-bottom-right-radius: 0;
        }

        .markdown-content :global(p) {
          margin-bottom: var(--space-2);
        }

        .markdown-content :global(p:last-child) {
          margin-bottom: 0;
        }

        .markdown-content :global(ul), .markdown-content :global(ol) {
          margin-left: var(--space-4);
          margin-bottom: var(--space-2);
        }

        .markdown-content :global(li) {
          margin-bottom: var(--space-1);
        }

        .markdown-content :global(strong) {
          font-weight: 700;
          color: var(--gray-900);
        }

        .markdown-content :global(code) {
          background: var(--gray-100);
          padding: 2px 4px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.875rem;
        }

        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 60px;
          padding: var(--space-2) var(--space-4);
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          background: var(--gray-400);
          border-radius: 50%;
          display: inline-block;
          animation: bounce 1.4s infinite ease-in-out both;
        }

        .typing-indicator span:nth-child(1) {
          animation-delay: -0.32s;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: -0.16s;
        }

        @keyframes bounce {
          0%, 80%, 100% { 
            transform: scale(0);
          } 40% { 
            transform: scale(1.0);
          }
        }

        .chatbot-input {
          padding: var(--space-4);
          background: white;
          border-top: 1px solid var(--gray-100);
          display: flex;
          gap: var(--space-2);
        }

        .chatbot-input input {
          flex: 1;
          border: 1px solid var(--gray-200);
          border-radius: var(--radius-full);
          padding: var(--space-2) var(--space-4);
          font-size: 0.9375rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .chatbot-input input:focus {
          border-color: var(--primary-400);
        }

        .chatbot-input button {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--primary-500);
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .chatbot-input button:hover:not(:disabled) {
          transform: scale(1.1);
          background: var(--primary-600);
        }

        .chatbot-input button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .chatbot-window {
            width: calc(100vw - 40px);
            height: 450px;
            bottom: 80px;
            right: 20px;
          }
        }
      `}</style>
        </div>
    );
}
