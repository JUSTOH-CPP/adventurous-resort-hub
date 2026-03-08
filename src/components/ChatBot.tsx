
import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{text: string, isUser: boolean}[]>([
    { text: "Hi there! 👋 I'm your personal Dandeli adventure guide. How can I help you plan your perfect nature getaway?", isUser: false }
  ]);
  const [input, setInput] = useState('');

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = () => {
    if (input.trim() === '') return;
    
    // Add user message
    setMessages([...messages, { text: input, isUser: true }]);
    setInput('');
    
    // Improved bot responses based on user input
    setTimeout(() => {
      let botResponse = "";
      const userInput = input.toLowerCase();
      
      if (userInput.includes("price") || userInput.includes("cost") || userInput.includes("rate")) {
        botResponse = "Our adventure packages start from KSh 1,999 per person. For the premium experience with luxury accommodation, rates are KSh 4,999 per night. Don't forget to check our ongoing special discount of 25% off on all bookings!";
      } 
      else if (userInput.includes("booking") || userInput.includes("reserve")) {
        botResponse = "Booking is super easy! You can either use our online booking form, contact us on WhatsApp at +918904704234, or call us directly. We recommend booking at least 2 weeks in advance during peak season (Oct-Feb).";
      }
      else if (userInput.includes("activity") || userInput.includes("adventure") || userInput.includes("rafting")) {
        botResponse = "We offer thrilling adventures including white water rafting (grades 2-3), jungle safaris, kayaking, and guided nature walks. Our most popular package is the 'Weekend Wilderness' which includes rafting, safari and overnight camping!";
      }
      else if (userInput.includes("location") || userInput.includes("reach") || userInput.includes("address")) {
        botResponse = "We're located in the heart of Dandeli Wildlife Sanctuary, Karnataka. The nearest airport is Goa International Airport (160km). We provide pickup services, and our resort is just 5km from Dandeli town center.";
      }
      else {
        botResponse = "Thanks for reaching out! Our adventure specialists would love to help you personally. Please contact us via WhatsApp or call us at +918904704234 for immediate assistance. Would you like to know about our adventure packages, accommodation options, or special offers?";
      }
      
      setMessages(prev => [...prev, { text: botResponse, isUser: false }]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-6 z-40">
      {/* Chat Button */}
      <Button
        onClick={toggleChat}
        className={cn(
          "w-14 h-14 rounded-full shadow-lg flex items-center justify-center",
          "bg-green-600 hover:bg-green-700 transition-all duration-300", 
          !isOpen && "animate-bounce"
        )}
        aria-label="Chat with us"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>

      {/* Chat Window */}
      <div 
        className={cn(
          "absolute bottom-20 right-0 w-80 bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 transform",
          "flex flex-col border border-border",
          isOpen ? "scale-100 opacity-100" : "scale-90 opacity-0 pointer-events-none"
        )}
        style={{ height: isOpen ? '400px' : '0' }}
      >
        {/* Header */}
        <div className="bg-green-600 p-4 text-white">
          <h3 className="font-bold">Adventure Support</h3>
          <p className="text-xs opacity-80">We typically reply within minutes</p>
        </div>
        
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col space-y-3">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={cn(
                "max-w-[80%] p-3 rounded-lg",
                message.isUser 
                  ? "bg-green-600 text-white self-end rounded-br-none"
                  : "bg-gray-100 self-start rounded-bl-none"
              )}
            >
              {message.text}
            </div>
          ))}
        </div>
        
        {/* Input */}
        <div className="p-3 border-t border-border flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-green-600"
          />
          <Button 
            onClick={handleSend}
            className="rounded-l-none bg-green-600 hover:bg-green-700"
            disabled={input.trim() === ''}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
