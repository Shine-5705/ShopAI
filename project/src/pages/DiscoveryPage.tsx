import React, { useState, useEffect } from 'react';
import { Filter, Grid, List, Star, Heart, Info, TrendingUp, MapPin, Calendar, Zap, Gift, Eye, ShoppingCart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  aiReason: string;
  contextualTags: string[];
  isLiked?: boolean;
  discount?: number;
}

export function DiscoveryPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [animatedProducts, setAnimatedProducts] = useState<Set<string>>(new Set());

  const products: Product[] = [
    {
      id: '1',
      name: 'Cozy Knit Sweater',
      price: 89,
      originalPrice: 120,
      rating: 4.8,
      reviews: 342,
      image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'Weather Match',
      aiReason: 'Perfect for today\'s chilly weather (52°F). Matches your preference for comfortable, casual styles.',
      contextualTags: ['Weather: Cold', 'Style: Casual', 'Occasion: Daily'],
      discount: 26
    },
    {
      id: '2',
      name: 'Smart Fitness Tracker',
      price: 199,
      rating: 4.6,
      reviews: 1283,
      image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'Health Goal',
      aiReason: 'Aligns with your fitness goals. Your calendar shows gym sessions 3x/week - this will help track progress.',
      contextualTags: ['Health: Fitness', 'Goal: Active', 'Budget: Mid-range']
    },
    {
      id: '3',
      name: 'Elegant Evening Dress',
      price: 159,
      originalPrice: 240,
      rating: 4.9,
      reviews: 156,
      image: 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'Event Ready',
      aiReason: 'Perfect for your dinner reservation this Friday. Color complements your recent purchase preferences.',
      contextualTags: ['Event: Dinner', 'Style: Elegant', 'Color: Preferred'],
      discount: 34
    },
    {
      id: '4',
      name: 'Wireless Headphones',
      price: 249,
      originalPrice: 299,
      rating: 4.7,
      reviews: 892,
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'Work Essential',
      aiReason: 'Recommended based on your WFH setup and frequent video calls. Noise cancellation matches your needs.',
      contextualTags: ['Work: Remote', 'Feature: Noise Cancel', 'Priority: High'],
      discount: 17
    },
    {
      id: '5',
      name: 'Skincare Serum Set',
      price: 129,
      rating: 4.8,
      reviews: 567,
      image: 'https://images.pexels.com/photos/3612181/pexels-photo-3612181.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'Routine Match',
      aiReason: 'Complements your morning skincare routine. Ingredients align with your sensitive skin preferences.',
      contextualTags: ['Routine: Morning', 'Skin: Sensitive', 'Category: Skincare']
    },
    {
      id: '6',
      name: 'Modern Table Lamp',
      price: 79,
      originalPrice: 110,
      rating: 4.5,
      reviews: 234,
      image: 'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'Mood Boost',
      aiReason: 'Bright lighting can improve mood during shorter days. Style matches your modern home aesthetic.',
      contextualTags: ['Season: Winter', 'Style: Modern', 'Purpose: Mood'],
      discount: 28
    }
  ];

  const filters = [
    { name: 'Price Range', type: 'range' },
    { name: 'Rating', type: 'checkbox', options: ['4+ Stars', '3+ Stars'] },
    { name: 'Category', type: 'checkbox', options: ['Fashion', 'Electronics', 'Beauty', 'Home'] },
    { name: 'Context', type: 'checkbox', options: ['Weather Match', 'Event Ready', 'Work Essential', 'Health Goal'] }
  ];

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const toggleLike = (productId: string) => {
    setLikedProducts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(productId)) {
        newLiked.delete(productId);
      } else {
        newLiked.add(productId);
        // Add animation
        setAnimatedProducts(prev => new Set(prev).add(productId));
        setTimeout(() => {
          setAnimatedProducts(prev => {
            const newAnimated = new Set(prev);
            newAnimated.delete(productId);
            return newAnimated;
          });
        }, 600);
      }
      return newLiked;
    });
  };

  // Stagger product animations on load
  useEffect(() => {
    products.forEach((_, index) => {
      setTimeout(() => {
        setAnimatedProducts(prev => new Set(prev).add(`load-${index}`));
      }, index * 100);
    });
  }, []);

  return (
    <div className="min-h-screen pt-8 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
              <Zap className="h-10 w-10 mr-3 text-indigo-600 animate-pulse" />
              Smart Discovery
            </h1>
            <p className="text-xl text-gray-600">AI-curated products based on your context and preferences</p>
          </div>
          <div className="flex items-center space-x-4 animate-fade-in-up animation-delay-200">
            <div className="flex bg-white/80 backdrop-blur-md rounded-2xl p-1 shadow-lg border border-white/50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Enhanced Filters Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-6 sticky top-24 border border-white/50 animate-slide-in-left">
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="h-6 w-6 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-900">Smart Filters</h3>
              </div>

              {/* Enhanced Context Indicators */}
              <div className="mb-8">
                <h4 className="text-sm font-medium text-gray-700 mb-4">Current Context</h4>
                <div className="space-y-3">
                  {[
                    { icon: MapPin, text: 'Downtown Seattle', color: 'text-blue-500' },
                    { icon: TrendingUp, text: '52°F, Cloudy', color: 'text-green-500' },
                    { icon: Calendar, text: 'Dinner plans Friday', color: 'text-purple-500' }
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                      <span className="text-sm text-gray-700">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Price Range */}
              <div className="mb-8">
                <h4 className="text-sm font-medium text-gray-700 mb-4">Price Range</h4>
                <div className="px-3">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-3 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-3">
                    <span className="font-medium">$0</span>
                    <span className="font-bold text-indigo-600">${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Category Filters */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Categories</h4>
                  <div className="space-y-3">
                    {['Fashion', 'Electronics', 'Beauty', 'Home'].map((category, index) => (
                      <label 
                        key={category} 
                        className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilters.includes(category)}
                          onChange={() => toggleFilter(category)}
                          className="rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:ring-2"
                        />
                        <span className="ml-3 text-sm text-gray-700 group-hover:text-indigo-600 transition-colors">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Products Grid */}
          <div className="flex-1">
            <div className={`grid gap-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className={`bg-white/80 backdrop-blur-md rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group border border-white/50 hover:scale-105 animate-fade-in-up ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-64 flex-shrink-0' : ''}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`w-full object-cover group-hover:scale-110 transition-transform duration-500 ${
                        viewMode === 'list' ? 'h-64' : 'h-64'
                      }`}
                    />
                    
                    {/* Enhanced badges and overlays */}
                    {product.badge && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg animate-pulse">
                        {product.badge}
                      </div>
                    )}
                    
                    {product.discount && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-bounce">
                        -{product.discount}%
                      </div>
                    )}

                    {/* Enhanced heart button */}
                    <button 
                      onClick={() => toggleLike(product.id)}
                      className={`absolute bottom-4 right-4 p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                        likedProducts.has(product.id)
                          ? 'bg-red-500 text-white shadow-lg'
                          : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white'
                      } ${animatedProducts.has(product.id) ? 'animate-ping' : ''}`}
                    >
                      <Heart className={`h-5 w-5 ${likedProducts.has(product.id) ? 'fill-current' : ''}`} />
                    </button>

                    {/* Quick view overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button className="bg-white/90 backdrop-blur-sm text-gray-900 px-6 py-3 rounded-2xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2">
                        <Eye className="h-5 w-5" />
                        <span>Quick View</span>
                      </button>
                    </div>
                  </div>

                  <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {product.name}
                      </h3>
                      <button
                        onMouseEnter={() => setShowTooltip(product.id)}
                        onMouseLeave={() => setShowTooltip(null)}
                        className="relative p-2 text-indigo-500 hover:bg-indigo-50 rounded-full transition-all duration-200 hover:scale-110"
                      >
                        <Info className="h-5 w-5" />
                        {showTooltip === product.id && (
                          <div className="absolute right-0 top-12 w-72 bg-gray-900 text-white text-sm rounded-2xl p-4 z-10 shadow-2xl">
                            <div className="font-medium mb-2 flex items-center">
                              <Zap className="h-4 w-4 mr-2 text-yellow-400" />
                              Why this recommendation?
                            </div>
                            <div className="leading-relaxed">{product.aiReason}</div>
                          </div>
                        )}
                      </button>
                    </div>

                    {/* Enhanced rating */}
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-2 font-medium">{product.rating}</span>
                        <span className="text-sm text-gray-400 ml-1">({product.reviews})</span>
                      </div>
                    </div>

                    {/* Enhanced pricing */}
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-3xl font-bold text-indigo-600">${product.price}</span>
                      {product.originalPrice && (
                        <>
                          <span className="text-lg text-gray-400 line-through">
                            ${product.originalPrice}
                          </span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                            Save ${product.originalPrice - product.price}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Enhanced contextual tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {product.contextualTags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 text-xs rounded-full border border-indigo-200 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Enhanced action button */}
                    <button className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-4 rounded-2xl font-bold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
                      <ShoppingCart className="h-5 w-5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animation-delay-200 { animation-delay: 200ms; }
      `}</style>
    </div>
  );
}