import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { useI18n } from '../services/i18n';

export const AIChat: React.FC = () => {
  const { t, language } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: t("chat.welcome") }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Dynamic suggestions state (initially populated with defaults)
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    t("chat.q1"),
    t("chat.q2"),
    t("chat.q3"),
    t("chat.q4"),
  ]);

  useEffect(() => {
    if (isOpen) {
      // Reset messages to a fresh welcome message on open or language change
      setMessages([{ role: 'model', text: t("chat.welcome") }]);

      // Reset suggested questions to localized defaults
      setSuggestedQuestions([
        t("chat.q1"),
        t("chat.q2"),
        t("chat.q3"),
        t("chat.q4"),
      ]);
    }
  }, [isOpen, language, t]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside both panel AND button
      if (
        isOpen &&
        panelRef.current && 
        !panelRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isTyping) return;

    // Add User Message
    const userMessage: ChatMessage = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://127.0.0.1:8001/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          page: typeof window !== 'undefined' ? window.location.pathname : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // Add Model Response
      setMessages(prev => [...prev, { role: 'model', text: data.reply }]);

      // Update suggestions if provided by backend
      if (data.suggestions && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        setSuggestedQuestions(data.suggestions);
      }

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: t("chat.error"), isError: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] z-50 glass-panel rounded-2xl flex flex-col shadow-2xl overflow-hidden border border-white/10"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/5 bg-[#0A0A0A]/90 backdrop-blur-xl flex justify-between items-center relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                   <Sparkles className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <span className="block text-sm font-bold font-display text-white tracking-wide">Assistant</span>
                  <span className="block text-[10px] text-neutral-400 font-mono uppercase tracking-wider">AI Powered</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#050505]/80 scrollbar-hide">
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-[#1A1A1A] border border-white/10 text-white rounded-br-none' 
                      : 'bg-accent text-black font-medium rounded-bl-none shadow-[0_0_15px_rgba(255,61,0,0.15)]'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-accent/20 p-4 rounded-2xl rounded-bl-none flex items-center gap-1 w-16 h-10">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-accent rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }} className="w-1.5 h-1.5 bg-accent rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-accent rounded-full" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {!isTyping && messages.length > 0 && suggestedQuestions.length > 0 && (
              <div className="px-5 pb-2 bg-[#050505]/80">
                 <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mask-fade-right">
                    {suggestedQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(q)}
                        className="whitespace-nowrap flex-shrink-0 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[11px] text-neutral-300 hover:border-accent hover:text-accent transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                 </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-[#0A0A0A] border-t border-white/10">
              <div className="flex items-center gap-2 bg-[#141414] rounded-xl px-4 py-3 border border-white/5 focus-within:border-accent/50 transition-colors">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={t("chat.placeholder")}
                  autoFocus
                  className="flex-1 bg-transparent text-sm text-white placeholder-neutral-600 focus:outline-none font-sans"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={isTyping || !input.trim()}
                  className="text-neutral-500 hover:text-accent disabled:opacity-30 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl backdrop-blur-md border transition-all duration-300 group ${
            isOpen 
            ? 'bg-neutral-800 border-neutral-700 text-neutral-400' 
            : 'bg-[#111] border-accent/30 text-accent shadow-[0_0_20px_rgba(255,61,0,0.2)] hover:shadow-[0_0_30px_rgba(255,61,0,0.4)]'
        }`}
      >
        <AnimatePresence mode='wait'>
            {isOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <X className="w-6 h-6" />
                </motion.div>
            ) : (
                <motion.div key="chat" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                    <MessageSquare className="w-6 h-6" />
                </motion.div>
            )}
        </AnimatePresence>
        
        {/* Hover Text Hint */}
        {!isOpen && (
            <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {t("chat.openHint")}
            </span>
        )}
      </motion.button>
    </>
  );
};