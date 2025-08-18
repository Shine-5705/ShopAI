/*
  # Initial Schema for AI Shopping Assistant

  1. New Tables
    - `profiles` - User profile information
    - `products` - Product catalog with AR support
    - `shortlists` - User-created product collections
    - `shortlist_items` - Items within shortlists with voting
    - `comments` - Comments on shortlist items
    - `ai_interactions` - Log of AI assistant interactions
    - `user_preferences` - User shopping preferences by category

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure data access based on user ownership

  3. Functions
    - AI recommendation function
    - Product search with similarity scoring
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  phone text,
  location text,
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL,
  original_price decimal(10,2),
  category text NOT NULL,
  subcategory text,
  brand text,
  image_urls text[] DEFAULT '{}',
  rating decimal(3,2) DEFAULT 0,
  review_count integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  ar_compatible boolean DEFAULT false,
  ar_model_url text,
  inventory_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  embedding vector(1536), -- For AI similarity search
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Shortlists table
CREATE TABLE IF NOT EXISTS shortlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  is_public boolean DEFAULT false,
  collaborators text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE shortlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own shortlists"
  ON shortlists
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public shortlists"
  ON shortlists
  FOR SELECT
  TO authenticated
  USING (is_public = true);

-- Shortlist items table
CREATE TABLE IF NOT EXISTS shortlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shortlist_id uuid REFERENCES shortlists(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  added_by uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  votes_up integer DEFAULT 0,
  votes_down integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(shortlist_id, product_id)
);

ALTER TABLE shortlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage shortlist items they own"
  ON shortlist_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shortlists 
      WHERE shortlists.id = shortlist_items.shortlist_id 
      AND shortlists.user_id = auth.uid()
    )
  );

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shortlist_item_id uuid REFERENCES shortlist_items(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read comments on accessible shortlists"
  ON comments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shortlist_items si
      JOIN shortlists s ON s.id = si.shortlist_id
      WHERE si.id = comments.shortlist_item_id
      AND (s.user_id = auth.uid() OR s.is_public = true)
    )
  );

CREATE POLICY "Users can create comments on accessible shortlists"
  ON comments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM shortlist_items si
      JOIN shortlists s ON s.id = si.shortlist_id
      WHERE si.id = comments.shortlist_item_id
      AND (s.user_id = auth.uid() OR s.is_public = true)
    )
  );

-- AI interactions table
CREATE TABLE IF NOT EXISTS ai_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  interaction_type text NOT NULL,
  context jsonb NOT NULL DEFAULT '{}',
  response jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own AI interactions"
  ON ai_interactions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL,
  preferences jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, category)
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own preferences"
  ON user_preferences
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);
CREATE INDEX IF NOT EXISTS idx_products_embedding ON products USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_shortlists_user_id ON shortlists(user_id);
CREATE INDEX IF NOT EXISTS idx_shortlist_items_shortlist_id ON shortlist_items(shortlist_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_user_id ON ai_interactions(user_id);

-- Function to get personalized recommendations
CREATE OR REPLACE FUNCTION get_personalized_recommendations(
  user_id uuid,
  limit_count integer DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  name text,
  price decimal,
  image_urls text[],
  rating decimal,
  relevance_score float,
  ai_reason text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.price,
    p.image_urls,
    p.rating,
    RANDOM() as relevance_score, -- Simplified for now, would use ML model
    CASE 
      WHEN p.category = 'fashion' THEN 'Matches your style preferences'
      WHEN p.category = 'electronics' THEN 'Perfect for your tech needs'
      ELSE 'Recommended based on your activity'
    END as ai_reason
  FROM products p
  WHERE p.is_active = true
  ORDER BY relevance_score DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search products with similarity
CREATE OR REPLACE FUNCTION search_products(
  search_query text,
  category_filter text DEFAULT NULL,
  price_min decimal DEFAULT NULL,
  price_max decimal DEFAULT NULL,
  limit_count integer DEFAULT 20
)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  price decimal,
  image_urls text[],
  rating decimal,
  similarity_score float
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.description,
    p.price,
    p.image_urls,
    p.rating,
    similarity(p.name || ' ' || p.description, search_query) as similarity_score
  FROM products p
  WHERE p.is_active = true
    AND (category_filter IS NULL OR p.category = category_filter)
    AND (price_min IS NULL OR p.price >= price_min)
    AND (price_max IS NULL OR p.price <= price_max)
    AND (p.name ILIKE '%' || search_query || '%' OR p.description ILIKE '%' || search_query || '%')
  ORDER BY similarity_score DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shortlists_updated_at
  BEFORE UPDATE ON shortlists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();