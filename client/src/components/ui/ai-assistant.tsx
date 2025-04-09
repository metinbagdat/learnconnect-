import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Laptop, Send } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface Message {
  isUser: boolean;
  text: string;
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      isUser: false, 
      text: "Hello! I'm your AI Learning Assistant. How can I help you today?" 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = inputMessage;
    setInputMessage('');
    
    // Add user message to chat
    setMessages(prev => [...prev, { isUser: true, text: userMessage }]);
    
    setIsLoading(true);
    
    try {
      // Send message to API
      const response = await apiRequest('POST', '/api/ai/chat', { message: userMessage });
      const data = await response.json();
      
      // Add AI response to chat
      setMessages(prev => [...prev, { isUser: false, text: data.message }]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get a response from the AI assistant",
        variant: "destructive",
      });
      
      // Add fallback message
      setMessages(prev => [...prev, { 
        isUser: false, 
        text: "I'm having trouble processing your request right now. Please try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 bg-accent-500 rounded-full flex items-center justify-center">
              <Laptop className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="ml-4">
            <CardTitle className="text-lg">AI Learning Assistant</CardTitle>
            <p className="text-sm text-neutral-600">Get personalized help with your coursework</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Message Container */}
        <div className="mt-4 bg-neutral-50 rounded-lg p-4 max-h-60 overflow-y-auto">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex items-start mb-4 ${message.isUser ? 'justify-end' : ''}`}
            >
              {!message.isUser && (
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-accent-500 flex items-center justify-center">
                    <Laptop className="h-5 w-5 text-white" />
                  </div>
                </div>
              )}
              <div 
                className={`mx-3 py-2 px-3 rounded-lg shadow-sm ${
                  message.isUser 
                    ? 'bg-primary text-white' 
                    : 'bg-white text-neutral-800'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              </div>
              {message.isUser && (
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-neutral-200 overflow-hidden">
                    <img 
                      className="h-full w-full object-cover" 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80" 
                      alt="User" 
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-accent-500 flex items-center justify-center">
                  <Laptop className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="mx-3 py-2 px-3 bg-white rounded-lg shadow-sm">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-neutral-300 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-neutral-300 rounded-full animate-bounce delay-150"></div>
                  <div className="h-2 w-2 bg-neutral-300 rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Input Area */}
        <div className="mt-4 relative">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your question..."
            className="pr-10"
            disabled={isLoading}
          />
          <Button
            size="icon"
            variant="ghost" 
            className="absolute right-0 top-0 bottom-0"
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
