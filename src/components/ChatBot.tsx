import { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import Button from './Button';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatBotProps {
  courseId: number;
}

function formatMessage(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/#{1,3}\s/g, '')
    .replace(/^- /gm, '• ')
    .replace(/^\d+\.\s/gm, '• ');
}

export default function ChatBot({ courseId }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

    setLoading(true);
    try {
      const response = await api.post(`/courses/${courseId}/chat`, { message: userMessage });
      setMessages((prev) => [...prev, { role: 'assistant', content: response.data.response }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary text-white w-14 h-14 rounded-full shadow-lg hover:bg-primary-hover transition flex items-center justify-center text-2xl z-50 cursor-pointer"
      >
        💬
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-light-card dark:bg-dark-card rounded-xl shadow-2xl border border-light-border dark:border-dark-border flex flex-col z-50">
      {/* Header */}
      <div className="bg-primary px-4 py-3 rounded-t-xl flex items-center gap-3">
        <img src="/pi-avatar.png" alt="PI" className="w-8 h-8 rounded-full" />
        <div className="flex-1">
          <h3 className="font-semibold text-white text-sm">Theus</h3>
          <span className="text-white/60 text-xs">Course Assistant</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white text-xl">
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center mt-10">
            <img src="/pi-avatar.png" alt="PI" className="w-16 h-16 rounded-full mx-auto mb-3" />
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">
              Olá! meu nome é <span className="font-semibold">Theus</span>, seus assistente de curso. me pergunte algo sobre o curso ou peça ajuda para navegar pela plataforma!
            </p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <img src="/pi-avatar.png" alt="Theus" className="w-6 h-6 rounded-full mr-2 mt-1 flex-shrink-0" />
            )}
            <div
              className={`max-w-[80%] px-3 py-2 rounded-lg text-sm whitespace-pre-line ${
                msg.role === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text border border-light-border dark:border-dark-border'
              }`}
            >
              {msg.role === 'assistant' ? formatMessage(msg.content) : msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <img src="/pi-avatar.png" alt="PI" className="w-6 h-6 rounded-full mr-2 mt-1 flex-shrink-0" />
            <div className="bg-light-bg dark:bg-dark-bg text-light-text-secondary dark:text-dark-text-secondary px-3 py-2 rounded-lg text-sm border border-light-border dark:border-dark-border">
              Theus is typing...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-light-border dark:border-dark-border p-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Pergunte algo para Theus..."
          className="flex-1 px-3 py-2 border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={loading}
        />
        <Button onClick={handleSend} disabled={loading}>
          Send
        </Button>
      </div>
    </div>
  );
}