import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

interface ChatRequest {
  message: string;
  context?: {
    location?: string;
    weather?: any;
    calendar?: any;
    preferences?: any;
    currentPage?: string;
  };
  userId?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, context = {}, userId }: ChatRequest = await req.json()

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Generate AI response based on message and context
    const response = await generateAIResponse(message, context, supabaseClient)

    // Log the interaction if user is authenticated
    if (userId) {
      await supabaseClient
        .from('ai_interactions')
        .insert({
          user_id: userId,
          interaction_type: 'chat',
          context: { message, ...context },
          response: response
        })
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

async function generateAIResponse(message: string, context: any, supabase: any) {
  const lowerMessage = message.toLowerCase()

  // Context-aware responses
  if (lowerMessage.includes('weather') || lowerMessage.includes('cold') || lowerMessage.includes('cozy')) {
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('category', 'fashion')
      .contains('tags', ['cozy'])
      .limit(3)

    return {
      text: `Perfect timing! With the chilly weather, I found some cozy essentials that'll keep you warm and stylish. These items have amazing reviews! 🤗`,
      type: 'product',
      products: products || [],
      suggestions: [
        "Show me matching accessories 🧣",
        "Find winter boots too 👢",
        "What about a warm coat? 🧥"
      ]
    }
  }

  if (lowerMessage.includes('trending') || lowerMessage.includes('popular')) {
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .order('rating', { ascending: false })
      .limit(4)

    return {
      text: `The hottest trends right now are absolutely amazing! I've curated the top trending items based on ratings and popularity! 🔥`,
      type: 'product',
      products: products || [],
      suggestions: [
        "Show me more trending items 📈",
        "Filter by category 🏷️",
        "Find deals on trending items 💰"
      ]
    }
  }

  if (lowerMessage.includes('deal') || lowerMessage.includes('sale') || lowerMessage.includes('discount')) {
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .not('original_price', 'is', null)
      .limit(4)

    return {
      text: `You're in luck! I found some incredible deals with up to 40% off! These limited-time offers won't last long! ⚡`,
      type: 'deal',
      products: products || [],
      suggestions: [
        "Show me all deals 💸",
        "Fashion deals only 👗",
        "Electronics on sale 📱"
      ]
    }
  }

  // Default personalized response
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .limit(3)

  return {
    text: `I'm here to help you find exactly what you're looking for! Based on what's popular and trending, here are some great options for you! ✨`,
    type: 'suggestion',
    products: products || [],
    suggestions: [
      "Show me trending items 🔥",
      "Find deals for me 💰",
      "Surprise me! ✨",
      "Help me with AR try-on 📱"
    ]
  }
}