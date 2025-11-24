import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Send, 
  MessageCircle, 
  Lightbulb, 
  Heart,
  Trash2,
  BookOpen,
  Target,
  Zap,
  RefreshCw,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/contexts/consolidated-language-context';
import { useQuery } from '@tanstack/react-query';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface EnhancedAIAssistantProps {
  courseId?: number;
  lessonId?: number;
  className?: string;
}

export function EnhancedAIAssistant({ courseId, lessonId, className = '' }: EnhancedAIAssistantProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch study tips
  const { data: studyTips = [], refetch: refetchTips } = useQuery<string[]>({
    queryKey: ['/api/ai/study-tips'],
    enabled: !!user,
  });

  // Fetch motivational message
  const { data: motivationData, refetch: refetchMotivation } = useQuery<{ message: string }>({
    queryKey: ['/api/ai/motivation'],
    enabled: !!user,
  });

  // Initialize with welcome message
  useEffect(() => {
    if (user && messages.length === 0) {
      const welcomeMessage: Message = {
        role: 'assistant',
        content: t('welcomeMessage').replace('{name}', user.displayName),
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [user, messages.length]);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message function
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Add user message to chat
    const newUserMessage: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);
    
    setIsLoading(true);
    
    try {
      // Send message to API with course context
      const response = await apiRequest('POST', '/api/ai/chat', { 
        message: userMessage,
        courseId,
        lessonId 
      });
      const data = await response.json();
      
      // Add AI response to chat
      const aiMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: t('connectionError'),
        description: t('connectionErrorDesc'),
        variant: "destructive",
      });
      
      // Add fallback message
      const errorMessage: Message = {
        role: 'assistant',
        content: t('troubleConnecting'),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat history
  const clearChat = async () => {
    try {
      await apiRequest('DELETE', '/api/ai/chat/history');
      setMessages([{
        role: 'assistant',
        content: t('chatHistoryCleared'),
        timestamp: new Date()
      }]);
      toast({
        title: t('chatCleared'),
        description: t('chatClearedDesc'),
      });
    } catch (error) {
      console.error('Error clearing chat:', error);
      toast({
        title: t('error'),
        description: t('failedToClearChat'),
        variant: "destructive",
      });
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Send quick action message
  const sendQuickAction = async (prompt: string) => {
    if (isLoading) return;
    
    const userMessage = prompt;
    const newUserMessage: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);
    
    try {
      const response = await apiRequest('POST', '/api/ai/chat', { 
        message: userMessage,
        courseId,
        lessonId 
      });
      const data = await response.json();
      
      const aiMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: t('connectionError'),
        description: t('connectionErrorDesc'),
        variant: "destructive",
      });
      
      const errorMessage: Message = {
        role: 'assistant',
        content: t('troubleConnecting'),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick action buttons
  const quickActions = [
    {
      label: t('explainConcept'),
      action: () => sendQuickAction(t('explainConceptPrompt'))
    },
    {
      label: t('practiceProblem'),
      action: () => sendQuickAction(t('practiceProblemPrompt'))
    },
    {
      label: t('studyTipsLabel'),
      action: () => sendQuickAction(t('studyTipsPrompt'))
    },
    {
      label: t('reviewHelp'),
      action: () => sendQuickAction(t('reviewHelpPrompt'))
    }
  ];

  return (
    <Card className={`shadow-lg border-0 bg-white/80 backdrop-blur-sm ${className} ${isExpanded ? 'fixed inset-4 z-50' : ''}`}>
      <CardHeader className="pb-3 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-800">{t('aiStudyCompanion')}</CardTitle>
              <p className="text-sm text-gray-600">{t('personalLearningAssistant')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-50">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              {t('chat')}
            </TabsTrigger>
            <TabsTrigger value="tips" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              {t('tips')}
            </TabsTrigger>
            <TabsTrigger value="motivation" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              {t('motivation')}
            </TabsTrigger>
          </TabsList>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-4 p-4">
            {/* Course Context Display */}
            {courseId && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-blue-700">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm font-medium">{t('courseContextActive')}</span>
                  {lessonId && (
                    <Badge variant="secondary" className="text-xs">
                      {t('lessonNumber')}{lessonId}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Messages Container */}
            <div className={`bg-gray-50 rounded-lg p-4 overflow-y-auto ${isExpanded ? 'h-96' : 'h-80'}`}>
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 mr-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  )}
                  
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                        : 'bg-white text-gray-800 border'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {message.role === 'user' && (
                    <div className="flex-shrink-0 ml-3">
                      <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
                        <div className="h-full w-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-semibold text-sm">
                          {user?.displayName?.[0]?.toUpperCase() || 'U'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="flex-shrink-0 mr-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm border">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                      <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce delay-300"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={action.action}
                  className="text-xs"
                  disabled={isLoading}
                >
                  {action.label}
                </Button>
              ))}
            </div>
            
            {/* Input Area */}
            <div className="flex items-end space-x-2">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('askMeAnything')}
                  className="w-full p-3 pr-12 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  disabled={isLoading}
                />
                <Button
                  size="sm"
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="absolute right-2 bottom-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Study Tips Tab */}
          <TabsContent value="tips" className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  {t('personalizedStudyTips')}
                </h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => refetchTips()}
                  className="text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  {t('refreshLabel')}
                </Button>
              </div>
              
              <div className="space-y-3">
                {studyTips.length > 0 ? (
                  studyTips.map((tip, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg"
                    >
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{tip}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Lightbulb className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p>{t('personalizedStudyTipsDesc')}</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Motivation Tab */}
          <TabsContent value="motivation" className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-500" />
                  {t('dailyMotivation')}
                </h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => refetchMotivation()}
                  className="text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  {t('newMessage')}
                </Button>
              </div>
              
              {motivationData?.message ? (
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700 leading-relaxed">{motivationData.message}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Heart className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>{t('dailyMotivationDesc')}</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}