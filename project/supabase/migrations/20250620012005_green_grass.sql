/*
  # Seed Sample Data

  1. Sample Products
    - Fashion items
    - Electronics
    - Home & Garden
    - Beauty products

  2. Sample User Data
    - Test profiles
    - Preferences
    - Shortlists
*/

-- Insert sample products
INSERT INTO products (name, description, price, original_price, category, subcategory, brand, image_urls, rating, review_count, tags, ar_compatible) VALUES
-- Fashion
('Cozy Knit Sweater', 'Soft and comfortable knit sweater perfect for chilly weather', 89.00, 120.00, 'fashion', 'clothing', 'ComfortWear', ARRAY['https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=400'], 4.8, 342, ARRAY['cozy', 'winter', 'casual'], true),
('Elegant Evening Dress', 'Sophisticated dress perfect for special occasions', 159.00, 240.00, 'fashion', 'clothing', 'ElegantStyle', ARRAY['https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=400'], 4.9, 156, ARRAY['elegant', 'formal', 'evening'], true),
('Casual Jeans', 'Comfortable everyday jeans with perfect fit', 79.00, NULL, 'fashion', 'clothing', 'DenimCo', ARRAY['https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400'], 4.5, 892, ARRAY['casual', 'everyday', 'comfortable'], true),
('Designer Sunglasses', 'Stylish sunglasses with UV protection', 159.00, 199.00, 'fashion', 'accessories', 'LuxVision', ARRAY['https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=400'], 4.7, 234, ARRAY['stylish', 'protection', 'luxury'], true),

-- Electronics
('Smart Fitness Tracker', 'Advanced fitness tracking with heart rate monitoring', 199.00, NULL, 'electronics', 'wearables', 'FitTech', ARRAY['https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400'], 4.6, 1283, ARRAY['fitness', 'health', 'smart'], false),
('Wireless Headphones', 'Premium noise-cancelling wireless headphones', 249.00, 299.00, 'electronics', 'audio', 'SoundPro', ARRAY['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400'], 4.7, 892, ARRAY['wireless', 'noise-cancelling', 'premium'], false),
('Smart Home Speaker', 'Voice-controlled smart speaker with AI assistant', 129.00, 159.00, 'electronics', 'smart-home', 'HomeTech', ARRAY['https://images.pexels.com/photos/4790268/pexels-photo-4790268.jpeg?auto=compress&cs=tinysrgb&w=400'], 4.4, 567, ARRAY['smart', 'voice-control', 'ai'], false),

-- Home & Garden
('Modern Table Lamp', 'Sleek modern lamp perfect for any room', 79.00, 110.00, 'home', 'lighting', 'ModernHome', ARRAY['https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=400'], 4.5, 234, ARRAY['modern', 'lighting', 'decor'], true),
('Ergonomic Office Chair', 'Comfortable office chair with lumbar support', 299.00, 399.00, 'home', 'furniture', 'OfficeComfort', ARRAY['https://images.pexels.com/photos/447592/pexels-photo-447592.jpeg?auto=compress&cs=tinysrgb&w=400'], 4.8, 445, ARRAY['ergonomic', 'office', 'comfort'], true),
('Modern Sofa Set', 'Comfortable 3-seat sofa with premium fabric', 899.00, 1299.00, 'home', 'furniture', 'LivingSpace', ARRAY['https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400'], 4.8, 1234, ARRAY['comfortable', 'modern', 'premium'], true),

-- Beauty
('Skincare Serum Set', 'Complete skincare routine with vitamin C serum', 129.00, NULL, 'beauty', 'skincare', 'GlowSkin', ARRAY['https://images.pexels.com/photos/3612181/pexels-photo-3612181.jpeg?auto=compress&cs=tinysrgb&w=400'], 4.8, 567, ARRAY['skincare', 'vitamin-c', 'anti-aging'], false),
('Lipstick Collection', 'Premium matte lipstick in various shades', 45.00, 65.00, 'beauty', 'makeup', 'ColorPro', ARRAY['https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=400'], 4.9, 3456, ARRAY['lipstick', 'matte', 'long-lasting'], true),
('Eyeshadow Palette', '12-color eyeshadow palette with blending brush', 39.00, 59.00, 'beauty', 'makeup', 'ColorPro', ARRAY['https://images.pexels.com/photos/2533228/pexels-photo-2533228.jpeg?auto=compress&cs=tinysrgb&w=400'], 4.7, 2134, ARRAY['eyeshadow', 'palette', 'versatile'], true);

-- Update inventory counts
UPDATE products SET inventory_count = FLOOR(RANDOM() * 100) + 10 WHERE inventory_count = 0;