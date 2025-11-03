
import React, { useState, useRef, useEffect } from 'react';
import { getChatbotResponseStream } from '../services/geminiService';
import { ChatMessage } from '../types';
import { ChatBubbleIcon, XMarkIcon, SendIcon, SparklesIcon, UserIcon } from './icons';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;
    
    const userMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        const stream = await getChatbotResponseStream(messages, input);
        
        let modelResponse = '';
        setMessages(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);

        for await (const chunk of stream) {
            modelResponse += chunk.text;
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { role: 'model', parts: [{ text: modelResponse }] };
                return newMessages;
            });
        }
    } catch (error) {
      console.error('Error with chatbot:', error);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: "Lo siento, ocurrió un error." }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110"
        aria-label="Abrir chat"
      >
        <ChatBubbleIcon className="h-8 w-8" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 w-full max-w-sm h-full max-h-[70vh] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col z-50">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t-lg">
        <h3 className="font-bold text-lg">Asistente Virtual</h3>
        <button onClick={toggleChat} aria-label="Cerrar chat">
          <XMarkIcon className="h-6 w-6" />
        </button>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'model' && <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900"><SparklesIcon className="w-6 h-6 text-blue-500" /></div>}
              <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-blue-100 dark:bg-blue-900'}`}>
                <p className="text-sm">{msg.parts[0].text}</p>
              </div>
              {msg.role === 'user' && <div className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"><UserIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" /></div>}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900"><SparklesIcon className="w-6 h-6 text-blue-500" /></div>
              <div className="max-w-xs px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                <div className="flex items-center space-x-1">
                  <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="p-4 border-t dark:border-gray-700">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tu pregunta..."
            className="flex-1 px-3 py-2 border rounded-l-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={handleSend} disabled={isLoading} className="bg-blue-600 text-white p-3 rounded-r-md hover:bg-blue-700 disabled:bg-blue-400">
            <SendIcon className="h-5 w-5" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Chatbot;
