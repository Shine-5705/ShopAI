import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface AIContext {
  location?: string;
  weather?: any;
  calendar?: any;
  preferences?: any;
  currentPage?: string;
}

interface AIResponse {
  text: string;
  suggestions?: string[];
  products?: any[];
  type?: 'text' | 'product' | 'deal' | 'suggestion';
}

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateResponse = async (
    message: string, 
    context: AIContext = {},
    userId?: string
  ): Promise<AIResponse> => {
    try {
      setLoading(true);
      setError(null);

      // Log the interaction
      if (userId) {
        await supabase
          .from('ai_interactions')
          .insert({
            user_id: userId,
            interaction_type: 'chat',
            context: { message, ...context },
            response: {} // Will be updated after we get the response
          });
      }

      // Simulate AI response based on message content
      const response = await simulateAIResponse(message, context);

      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return {
        text: "I'm sorry, I'm having trouble processing your request right now. Please try again.",
        type: 'text'
      };
    } finally {
      setLoading(false);
    }
  };

  const getContextualRecommendations = async (
    context: AIContext,
    userId?: string
  ): Promise<any[]> => {
    try {
      setLoading(true);
      
      if (userId) {
        const { data } = await supabase
          .rpc('get_personalized_recommendations', {
            user_id: userId,
            limit_count: 6
          });
        
        return data || [];
      }

      // Fallback to general recommendations
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .limit(6);

      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    generateResponse,
    getContextualRecommendations
  };
}

// Simulate AI response logic
async function simulateAIResponse(message: string, context: AIContext): Promise<AIResponse> {
  const lowerMessage = message.toLowerCase();

  // Weather-based responses
  if (lowerMessage.includes('cozy') || lowerMessage.includes('winter') || lowerMessage.includes('cold')) {
    return {
      text: `Perfect timing! With the chilly weather today, I found some cozy essentials that'll keep you warm and stylish. This chunky knit sweater has amazing reviews and customers say it's like wearing a hug! 🤗`,
      type: 'product',
      suggestions: [
        "Show me matching accessories 🧣",
        "Find winter boots too 👢",
        "What about a warm coat? 🧥"
      ]
    };
  }

  // Trending requests
  if (lowerMessage.includes('trending') || lowerMessage.includes('popular')) {
    return {
      text: `The hottest trends right now are absolutely amazing! Everyone's obsessing over sustainable fashion, smart home gadgets, and wellness products. I've curated the top trending items that match your vibe! 🔥`,
      type: 'product',
      suggestions: [
        "Show me sustainable fashion 🌱",
        "Find smart home deals 🏠",
        "Wellness products for me 💆‍♀️"
      ]
    };
  }

  // Gift suggestions
  if (lowerMessage.includes('gift') || lowerMessage.includes('present')) {
    return {
      text: `Gift hunting is my specialty! Based on popular choices and current trends, I have some incredible personalized gift ideas that'll make you the best gift-giver ever! 💝`,
      type: 'suggestion',
      suggestions: [
        "Show me personalized options 💝",
        "Gifts under $50 💰",
        "Luxury gift ideas ✨"
      ]
    };
  }

  // Deal requests
  if (lowerMessage.includes('deal') || lowerMessage.includes('sale') || lowerMessage.includes('discount')) {
    return {
      text: `You're in luck! I found some incredible flash deals just for you! There are limited-time offers up to 60% off on trending items, plus free shipping. But hurry - these deals won't last long! ⚡`,
      type: 'deal',
      suggestions: [
        "Show me all deals 💸",
        "Fashion deals only 👗",
        "Electronics on sale 📱"
      ]
    };
  }

  // Default response
  return {
    text: `Great question! I'm here to help you find exactly what you're looking for. Based on your preferences and what's trending, I can suggest some perfect matches that'll make your shopping experience amazing! ✨`,
    type: 'text',
    suggestions: [
      "Show me trending items 🔥",
      "Find deals for me 💰",
      "Surprise me! ✨"
    ]
  };
}