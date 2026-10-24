import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, AlertCircle, RefreshCw, ChevronDown, CheckCircle2 } from 'lucide-react';
import { apiRequest } from '../api';

export default function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "👋 Hi! I'm **Kernel AI**, your hardware & compatibility specialist powered by Google Gemini. Ask me anything about PC parts, compatibility checks, bottlenecking, or troubleshooting!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    "Is RTX 4070 Super compatible with B650?",
    "Build a ₹80,000 gaming PC list",
    "My PC won't display / No POST",
    "Does Ryzen 7 7800X3D need liquid cooling?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = { role: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const data = await apiRequest('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: query })
      });
      setMessages(prev => [...prev, { role: 'assistant', text: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `Could not get a response from the backend: ${err.message}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          <Bot className="w-5 h-5 text-white animate-bounce" />
          <span className="font-bold text-xs tracking-wide">Kernel AI Assistant</span>
        </button>
      )}

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[400px] h-[550px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-inner">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm">Kernel AI Assistant</h3>
                  <span className="px-1.5 py-0.2 bg-blue-500/20 text-blue-300 text-[10px] font-bold rounded">Gemini</span>
                </div>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online & Ready
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center text-slate-500 text-xs italic">
                <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                </div>
                <span>Analyzing specs and generating expert answer...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2.5 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="shrink-0 px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 text-[11px] font-medium rounded-full transition-colors border border-slate-200"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about specs, compatibility, or issues..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl shadow-md transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
