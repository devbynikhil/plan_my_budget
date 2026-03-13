"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useUser } from '@clerk/nextjs';
import { 
  Bot, 
  User, 
  Send, 
  Loader2, 
  TrendingUp, 
  DollarSign, 
  PieChart,
  Lightbulb,
  MessageCircle,
  BarChart3,
  Trash2,
  RefreshCw
} from 'lucide-react';

function AIAdvisorPage() {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user) {
      loadInitialInsights();
    }
  }, [user]);

  const loadInitialInsights = async () => {
    try {
      setLoadingInsights(true);
      const response = await fetch(`/api/ai/insights?email=${encodeURIComponent(user?.primaryEmailAddress?.emailAddress)}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setInsights(data);
        // Add welcome message with initial insights
        const welcomeMessage = {
          id: 'welcome-' + Date.now(),
          type: 'ai',
          content: `Hello ${user.firstName || 'there'}! 👋 I'm your AI Financial Advisor. I've analyzed your spending data and I'm ready to help you manage your finances better.

${data.aiInsights || 'I\'m here to help you with your financial questions!'}

Feel free to ask me anything about your finances!`,
          timestamp: new Date().toISOString(),
        };
        setMessages([welcomeMessage]);
      } else {
        // Set default insights if API fails
        setInsights({
          financialData: {
            summary: {
              totalBudget: 0,
              totalSpent: 0,
              remainingBudget: 0,
              budgetUtilizationPercentage: 0
            }
          },
          quickTips: [
            "Start by creating your first budget to track expenses",
            "Set realistic spending limits for different categories",
            "Review your spending weekly to stay on track"
          ]
        });
        
        const welcomeMessage = {
          id: 'welcome-' + Date.now(),
          type: 'ai',
          content: `Hello ${user.firstName || 'there'}! 👋 I'm your AI Financial Advisor. 

I'm ready to help you manage your finances better! Start by creating some budgets and transactions, then I can provide personalized insights.

Feel free to ask me anything about your finances!`,
          timestamp: new Date().toISOString(),
        };
        setMessages([welcomeMessage]);
        
        console.warn('Failed to load insights, using defaults:', data.error);
      }
    } catch (error) {
      console.error('Error loading insights:', error);
      
      // Set fallback data
      setInsights({
        financialData: {
          summary: {
            totalBudget: 0,
            totalSpent: 0,
            remainingBudget: 0,
            budgetUtilizationPercentage: 0
          }
        },
        quickTips: [
          "Welcome to your AI Financial Advisor!",
          "I'm here to help you manage your money better",
          "Ask me any questions about budgeting and saving"
        ]
      });
      
      const welcomeMessage = {
        id: 'welcome-' + Date.now(),
        type: 'ai',
        content: `Hello ${user.firstName || 'there'}! 👋 I'm your AI Financial Advisor.

I'm ready to help you with your financial questions! Feel free to ask me about budgeting, saving, or any money-related topics.`,
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
    } finally {
      setLoadingInsights(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const messageText = inputMessage.trim();
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: user?.primaryEmailAddress?.emailAddress,
          question: messageText,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const aiMessage = {
          id: Date.now() + Math.random(), // Better unique ID
          type: 'ai',
          content: data.response || "I'm sorry, I couldn't generate a response. Please try again.",
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Add error message to chat instead of just toast
        const errorMessage = {
          id: Date.now() + Math.random(),
          type: 'ai',
          content: "I'm sorry, I'm having trouble right now. Please try again in a moment.",
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, errorMessage]);
        
        toast({
          title: "Connection Issue",
          description: data.error || "Failed to get AI response",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + Math.random(),
        type: 'ai',
        content: "I'm experiencing technical difficulties. Please check your connection and try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Network Error",
        description: "Failed to send message. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "How can I reduce my spending?",
    "Am I overspending in any category?",
    "What's my biggest expense?",
    "How can I save more money?",
    "Is my budget realistic?",
    "What are some money-saving tips for me?",
  ];

  const clearChat = () => {
    setMessages([]);
    if (insights) {
      // Re-add welcome message
      const welcomeMessage = {
        id: 'welcome-' + Date.now(),
        type: 'ai',
        content: `Hello ${user.firstName || 'there'}! 👋 I'm your AI Financial Advisor. I'm ready to help you manage your finances better.

Feel free to ask me anything about your finances!`,
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
    }
  };

  const askQuickQuestion = async (question) => {
    if (loading) return; // Prevent clicking while loading
    
    // Create user message immediately
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: question,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: user?.primaryEmailAddress?.emailAddress,
          question: question,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const aiMessage = {
          id: Date.now() + Math.random(),
          type: 'ai',
          content: data.response || "I'm sorry, I couldn't generate a response. Please try again.",
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        const errorMessage = {
          id: Date.now() + Math.random(),
          type: 'ai',
          content: "I'm sorry, I'm having trouble right now. Please try again in a moment.",
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error with quick question:', error);
      const errorMessage = {
        id: Date.now() + Math.random(),
        type: 'ai',
        content: "I'm experiencing technical difficulties. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  if (loadingInsights) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading your financial insights...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bot className="h-8 w-8 text-blue-600" />
          AI Financial Advisor
        </h1>
        <p className="text-gray-600 mt-2">
          Get personalized financial insights and advice based on your spending data
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 min-h-[calc(100vh-200px)]">
        {/* Financial Summary Cards */}
        <div className="lg:col-span-1 space-y-4">
          {insights && (
            <>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Financial Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Budget:</span>
                    <span className="font-medium">₹{insights.financialData?.summary?.totalBudget || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Spent:</span>
                    <span className="font-medium">₹{insights.financialData?.summary?.totalSpent || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Remaining:</span>
                    <span className="font-medium text-green-600">₹{insights.financialData?.summary?.remainingBudget || 0}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Budget Used:</span>
                      <span className={`font-medium ${(insights.financialData?.summary?.budgetUtilizationPercentage || 0) > 90 ? 'text-red-600' : 'text-blue-600'}`}>
                        {(insights.financialData?.summary?.budgetUtilizationPercentage || 0).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Quick Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {insights.quickTips?.map((tip, index) => (
                      <div key={index} className="text-sm p-2 bg-blue-50 rounded border-l-2 border-blue-200">
                        {tip}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Quick Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {quickQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full text-left justify-start h-auto p-2 text-xs hover:bg-blue-50 transition-colors"
                        onClick={() => askQuickQuestion(question)}
                        disabled={loading}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2 flex flex-col">
          <Card className="flex-1 flex flex-col min-h-[600px]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    Chat with AI Advisor
                  </CardTitle>
                  <CardDescription>
                    Ask me anything about your finances and get personalized advice
                  </CardDescription>
                </div>
                {messages.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearChat}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-6">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 min-h-[400px]" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                {messages.length === 0 && !loading && (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>Start a conversation with your AI Financial Advisor!</p>
                      <p className="text-sm mt-2">Try asking about your budget, expenses, or savings tips.</p>
                    </div>
                  </div>
                )}
                
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
                  >
                    <div className={`flex gap-2 ${message.type === 'user' ? 'max-w-[85%] flex-row-reverse' : 'max-w-[95%] flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'user' ? 'bg-blue-600' : 'bg-gray-600'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div className={`p-4 rounded-lg shadow-sm ${
                        message.type === 'user' 
                          ? 'bg-blue-600 text-white rounded-br-sm' 
                          : 'bg-gray-100 text-gray-900 rounded-bl-sm border'
                      }`}>
                        <div className={`whitespace-pre-wrap leading-relaxed break-words ${
                          message.type === 'user' ? 'text-sm' : 'text-sm'
                        }`}>
                          {message.content}
                        </div>
                        <div className={`text-xs mt-2 ${
                          message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex gap-3 justify-start animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="p-3 rounded-lg bg-gray-100 border rounded-bl-sm">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                          <span className="text-sm text-gray-600">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex gap-2 pt-2 border-t bg-white">
                <div className="flex-1 relative">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me about your finances..."
                    disabled={loading}
                    className="pr-12 resize-none"
                    maxLength={500}
                  />
                  {inputMessage.length > 400 && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                      {500 - inputMessage.length}
                    </div>
                  )}
                </div>
                <Button 
                  onClick={sendMessage} 
                  disabled={loading || !inputMessage.trim()}
                  size="icon"
                  className="flex-shrink-0"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AIAdvisorPage;