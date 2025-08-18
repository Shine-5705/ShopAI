import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Mic, Camera, X, Sparkles, Zap, Heart, Star, Gift, TrendingUp, MapPin, Clock, Smile, ThumbsUp } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'voice' | 'image' | 'suggestion' | 'deal' | 'product';
  suggestions?: string[];
  products?: any[];
  isTyping?: boolean;
}

interface QuickAction {
  icon: React.ComponentType<any>;
  label: string;
  action: string;
  color: string;
}

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey there! 👋 I'm your AI shopping companion! I'm here to make shopping fun and effortless. I can help you discover amazing products, find the best deals, and even see how things look on you with AR! What's on your wishlist today?",
      sender: 'ai',
      timestamp: new Date(),
      suggestions: [
        "Find me something cozy for winter ❄️",
        "Show me trending tech gadgets 📱",
        "I need a gift for my friend 🎁",
        "Help me redecorate my room 🏠"
      ]
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions: QuickAction[] = [
    { icon: Sparkles, label: "Surprise me!", action: "surprise", color: "from-purple-500 to-pink-500" },
    { icon: TrendingUp, label: "What's trending?", action: "trending", color: "from-blue-500 to-indigo-500" },
    { icon: Gift, label: "Gift ideas", action: "gifts", color: "from-green-500 to-emerald-500" },
    { icon: Zap, label: "Flash deals", action: "deals", color: "from-orange-500 to-red-500" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      setUnreadCount(prev => prev + 1);
    } else if (isOpen) {
      setUnreadCount(0);
    }
  }, [messages, isOpen]);

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputText;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setShowQuickActions(false);
    setIsTyping(true);

    // Simulate AI typing and response
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(messageText),
        sender: 'ai',
        timestamp: new Date(),
        type: getResponseType(messageText),
        suggestions: getFollowUpSuggestions(messageText),
        products: messageText.toLowerCase().includes('show') ? getMockProducts() : undefined,
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  const getAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('surprise') || lowerInput.includes('random')) {
      return "🎉 Ooh, I love surprises! Based on your style and the chilly weather today, I found this gorgeous oversized sweater that's 40% off! It's perfect for cozy coffee dates and has amazing reviews. Plus, it comes in your favorite color palette! ✨";
    }
    
    if (lowerInput.includes('trending') || lowerInput.includes('popular')) {
      return "📈 The hottest trends right now are absolutely amazing! Everyone's obsessing over sustainable fashion, smart home gadgets, and wellness products. I've curated the top 5 trending items that match your vibe - they're flying off the shelves! 🔥";
    }
    
    if (lowerInput.includes('gift') || lowerInput.includes('present')) {
      return "🎁 Gift hunting is my specialty! Tell me a bit about them - are they into tech, fashion, books, or maybe something unique? I have some incredible personalized gift ideas that'll make you the best gift-giver ever! 💝";
    }
    
    if (lowerInput.includes('deal') || lowerInput.includes('sale')) {
      return "💸 You're in luck! I found some incredible flash deals just for you! There's a limited-time 60% off on that skincare set you've been eyeing, plus free shipping. But hurry - only 3 hours left! Should I add it to your cart? ⚡";
    }
    
    if (lowerInput.includes('cozy') || lowerInput.includes('winter')) {
      return "❄️ Perfect timing! With the temperature dropping to 45°F today, I found the coziest winter essentials that'll keep you warm and stylish. This chunky knit sweater has 4.9 stars and customers say it's like wearing a hug! 🤗";
    }

    const responses = [
      "✨ Great choice! I can see you have excellent taste. Based on your preferences and what's trending in your area, here are some perfect matches that'll make you absolutely love shopping with me! 💫",
      "🎯 I found exactly what you're looking for! Plus, I noticed there's a special promotion running that could save you 25%. Your timing is perfect - this is definitely meant to be! 🌟",
      "💡 Ooh, this is exciting! I have some amazing suggestions that align perfectly with your style. And guess what? I can show you how they'll look with AR try-on! Ready to be amazed? 🚀",
      "🔮 Based on your mood today and upcoming calendar events, I've curated some fantastic options. You're going to love what I found - it's like I read your mind! ✨",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getResponseType = (input: string): string => {
    if (input.toLowerCase().includes('show') || input.toLowerCase().includes('find')) return 'product';
    if (input.toLowerCase().includes('deal') || input.toLowerCase().includes('sale')) return 'deal';
    return 'text';
  };

  const getFollowUpSuggestions = (input: string): string[] => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('cozy') || lowerInput.includes('winter')) {
      return [
        "Show me matching accessories 🧣",
        "Find winter boots too 👢",
        "What about a warm coat? 🧥"
      ];
    }
    
    if (lowerInput.includes('gift')) {
      return [
        "Show me personalized options 💝",
        "What's their budget range? 💰",
        "Need gift wrapping? 🎀"
      ];
    }
    
    return [
      "Show me similar items ✨",
      "Check for better deals 💰",
      "Try AR preview 📱",
      "Add to shortlist ❤️"
    ];
  };

  const getMockProducts = () => [
    {
      name: "Cozy Knit Sweater",
      price: 89,
      originalPrice: 149,
      image: "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.9
    },
    {
      name: "Warm Winter Scarf",
      price: 35,
      originalPrice: 55,
      image: "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.7
    }
  ];

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate voice recording
      setTimeout(() => {
        setIsRecording(false);
        handleSendMessage("Show me cozy winter clothes");
      }, 2000);
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: `📸 Uploaded: ${file.name}`,
        sender: 'user',
        timestamp: new Date(),
        type: 'image',
      };
      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: "🤩 Wow, I love your style! I can see you uploaded a gorgeous piece. I found 8 similar items that match this aesthetic perfectly, plus some complementary pieces that would create amazing outfits! Want to see them all? ✨",
          sender: 'ai',
          timestamp: new Date(),
          suggestions: [
            "Show me similar styles 👗",
            "Find matching accessories 💍",
            "Create complete outfits 👠"
          ]
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleQuickAction = (action: string) => {
    const actionTexts = {
      surprise: "Surprise me with something amazing!",
      trending: "What's trending right now?",
      gifts: "I need some gift ideas",
      deals: "Show me the best deals today"
    };
    handleSendMessage(actionTexts[action as keyof typeof actionTexts]);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <>
      {/* Enhanced Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 group ${isOpen ? 'hidden' : 'block'}`}
      >
        <div className="relative">
          {/* Pulsing background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-pulse opacity-75 scale-110"></div>
          
          {/* Main button */}
          <div className="relative p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 transform">
            <MessageCircle className="h-6 w-6" />
            
            {/* Unread badge */}
            {unreadCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-bounce">
                {unreadCount}
              </div>
            )}
            
            {/* Floating sparkles */}
            <div className="absolute -top-1 -right-1 text-yellow-300 animate-ping">
              <Sparkles className="h-3 w-3" />
            </div>
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Chat with AI Assistant ✨
          </div>
        </div>
      </button>

      {/* Enhanced Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 h-[32rem] bg-white rounded-3xl shadow-2xl border border-gray-200/50 flex flex-col overflow-hidden backdrop-blur-xl">
          {/* Enhanced Header */}
          <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="h-5 w-5 animate-pulse" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h3 className="font-bold text-lg">ShopAI Assistant</h3>
                  <p className="text-xs text-white/80 flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                    Online & ready to help!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-110"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Animated background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-2 left-4 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
              <div className="absolute top-6 right-8 w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
              <div className="absolute bottom-3 left-12 w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce"></div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                  {message.sender === 'ai' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Sparkles className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-xs text-gray-500 font-medium">AI Assistant</span>
                    </div>
                  )}
                  
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white ml-4'
                        : 'bg-white border border-gray-200 text-gray-800 mr-4'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    
                    {message.type === 'image' && (
                      <div className="mt-2 p-2 bg-white/20 rounded-lg flex items-center">
                        <Camera className="h-4 w-4 mr-2" />
                        <span className="text-xs">Image uploaded</span>
                      </div>
                    )}

                    {message.products && (
                      <div className="mt-3 space-y-2">
                        {message.products.map((product, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-xl border">
                            <div className="flex items-center space-x-3">
                              <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm text-gray-900">{product.name}</h4>
                                <div className="flex items-center space-x-2">
                                  <span className="text-indigo-600 font-bold">${product.price}</span>
                                  {product.originalPrice && (
                                    <span className="text-gray-400 line-through text-xs">${product.originalPrice}</span>
                                  )}
                                  <div className="flex items-center">
                                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                    <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Suggestions */}
                  {message.suggestions && (
                    <div className="mt-3 space-y-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-sm transition-all duration-200 hover:scale-105 border border-indigo-200"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">AI is thinking...</span>
                </div>
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl shadow-sm mr-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {showQuickActions && (
            <div className="px-4 py-2 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.action)}
                    className={`flex items-center space-x-2 p-2 rounded-xl text-white text-xs font-medium transition-all duration-200 hover:scale-105 bg-gradient-to-r ${action.color}`}
                  >
                    <action.icon className="h-4 w-4" />
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Input */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything... ✨"
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                />
                <button
                  onClick={() => handleSendMessage()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-indigo-500 hover:bg-indigo-50 rounded-xl transition-all duration-200 hover:scale-110"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              
              <button
                onClick={handleVoiceInput}
                className={`p-3 rounded-2xl transition-all duration-200 hover:scale-110 ${
                  isRecording
                    ? 'bg-red-500 text-white animate-pulse shadow-lg'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg'
                }`}
              >
                <Mic className="h-4 w-4" />
              </button>
              
              <button
                onClick={handleImageUpload}
                className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg rounded-2xl transition-all duration-200 hover:scale-110"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      )}
    </>
  );
}