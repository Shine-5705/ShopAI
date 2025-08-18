import React, { useState, useEffect } from 'react';
import { Camera, Eye, Monitor, Smartphone, RotateCcw, Share2, Download, Play, Pause, Volume2, VolumeX, Maximize, Star, Heart, ShoppingCart, Sparkles } from 'lucide-react';

interface ARExperience {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  compatibility: string[];
  demoVideo?: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
}

interface ARDemo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  duration: string;
  views: string;
}

export function ARPage() {
  const [selectedCategory, setSelectedCategory] = useState('glasses');
  const [isARActive, setIsARActive] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<ARExperience | null>(null);
  const [playingDemo, setPlayingDemo] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showDemos, setShowDemos] = useState(true);

  const categories = [
    { id: 'glasses', name: 'Eyewear', icon: Eye, color: 'from-blue-500 to-indigo-500' },
    { id: 'clothing', name: 'Fashion', icon: Camera, color: 'from-pink-500 to-rose-500' },
    { id: 'furniture', name: 'Home', icon: Monitor, color: 'from-green-500 to-emerald-500' },
    { id: 'makeup', name: 'Beauty', icon: Smartphone, color: 'from-purple-500 to-violet-500' },
  ];

  const arDemos: ARDemo[] = [
    {
      id: '1',
      title: 'Virtual Glasses Try-On',
      description: 'See how different frames look on your face instantly',
      thumbnail: 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'glasses',
      duration: '0:45',
      views: '2.3M'
    },
    {
      id: '2',
      title: 'Fashion AR Fitting Room',
      description: 'Try on clothes without changing - see perfect fit',
      thumbnail: 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'clothing',
      duration: '1:12',
      views: '1.8M'
    },
    {
      id: '3',
      title: 'Furniture Placement AR',
      description: 'Visualize furniture in your space before buying',
      thumbnail: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'furniture',
      duration: '0:58',
      views: '3.1M'
    },
    {
      id: '4',
      title: 'Makeup Virtual Try-On',
      description: 'Test different makeup looks with realistic effects',
      thumbnail: 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'makeup',
      duration: '1:05',
      views: '4.2M'
    }
  ];

  const experiences: ARExperience[] = [
    {
      id: '1',
      name: 'Ray-Ban Aviator Classic',
      category: 'glasses',
      image: 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Classic aviator sunglasses with gold frame',
      compatibility: ['Phone', 'Tablet', 'Smart Mirror'],
      rating: 4.8,
      reviews: 2341,
      price: 159,
      originalPrice: 199
    },
    {
      id: '2',
      name: 'Designer Reading Glasses',
      category: 'glasses',
      image: 'https://images.pexels.com/photos/947885/pexels-photo-947885.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Modern prescription glasses with blue light protection',
      compatibility: ['Phone', 'Tablet'],
      rating: 4.9,
      reviews: 1876,
      price: 89,
      originalPrice: 129
    },
    {
      id: '3',
      name: 'Casual Summer Dress',
      category: 'clothing',
      image: 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Flowy summer dress perfect for any occasion',
      compatibility: ['Smart Mirror', 'Phone'],
      rating: 4.7,
      reviews: 892,
      price: 79,
      originalPrice: 120
    },
    {
      id: '4',
      name: 'Business Blazer',
      category: 'clothing',
      image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Professional blazer for business meetings',
      compatibility: ['Smart Mirror'],
      rating: 4.6,
      reviews: 567,
      price: 149,
      originalPrice: 199
    },
    {
      id: '5',
      name: 'Modern Sofa Set',
      category: 'furniture',
      image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Comfortable 3-seat sofa with premium fabric',
      compatibility: ['Phone', 'Tablet'],
      rating: 4.8,
      reviews: 1234,
      price: 899,
      originalPrice: 1299
    },
    {
      id: '6',
      name: 'Coffee Table',
      category: 'furniture',
      image: 'https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Minimalist oak coffee table',
      compatibility: ['Phone', 'Tablet'],
      rating: 4.5,
      reviews: 678,
      price: 299,
      originalPrice: 399
    },
    {
      id: '7',
      name: 'Lipstick Collection',
      category: 'makeup',
      image: 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Premium matte lipstick in various shades',
      compatibility: ['Phone', 'Smart Mirror'],
      rating: 4.9,
      reviews: 3456,
      price: 45,
      originalPrice: 65
    },
    {
      id: '8',
      name: 'Eyeshadow Palette',
      category: 'makeup',
      image: 'https://images.pexels.com/photos/2533228/pexels-photo-2533228.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: '12-color eyeshadow palette with blending brush',
      compatibility: ['Phone', 'Smart Mirror'],
      rating: 4.7,
      reviews: 2134,
      price: 39,
      originalPrice: 59
    }
  ];

  const filteredExperiences = experiences.filter(exp => exp.category === selectedCategory);
  const filteredDemos = arDemos.filter(demo => demo.category === selectedCategory);

  const startARExperience = (experience: ARExperience) => {
    setSelectedExperience(experience);
    setIsARActive(true);
  };

  const playDemo = (demoId: string) => {
    setPlayingDemo(playingDemo === demoId ? null : demoId);
  };

  // Auto-play demo rotation
  useEffect(() => {
    const interval = setInterval(() => {
      if (!playingDemo && showDemos) {
        const randomDemo = filteredDemos[Math.floor(Math.random() * filteredDemos.length)];
        if (randomDemo) {
          setPlayingDemo(randomDemo.id);
          setTimeout(() => setPlayingDemo(null), 3000);
        }
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [playingDemo, showDemos, filteredDemos]);

  return (
    <div className="min-h-screen pt-8 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated Header */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="w-96 h-96 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-3xl animate-pulse"></div>
          </div>
          <div className="relative">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-fade-in">
              AR Try-On Studio
              <span className="inline-block ml-2 animate-bounce">✨</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-slide-up">
              Experience products in your own space with cutting-edge augmented reality. 
              Try on glasses, clothes, test furniture placement, or experiment with makeup.
            </p>
          </div>
        </div>

        {/* Enhanced Category Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-2 inline-flex border border-white/20">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-4 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg scale-105`
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50/50'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <category.icon className="h-5 w-5" />
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* AR Demo Videos Section */}
        {showDemos && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                <Play className="h-8 w-8 mr-3 text-indigo-600" />
                See AR in Action
              </h2>
              <p className="text-gray-600">Watch real users experiencing our AR technology</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {filteredDemos.map((demo, index) => (
                <div
                  key={demo.id}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-105"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative">
                    <img
                      src={demo.thumbnail}
                      alt={demo.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Play overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => playDemo(demo.id)}
                        className="bg-white/90 backdrop-blur-sm p-4 rounded-full hover:bg-white transition-colors transform hover:scale-110"
                      >
                        {playingDemo === demo.id ? (
                          <Pause className="h-8 w-8 text-indigo-600" />
                        ) : (
                          <Play className="h-8 w-8 text-indigo-600" />
                        )}
                      </button>
                    </div>

                    {/* Video stats */}
                    <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded-lg text-xs">
                      {demo.duration}
                    </div>
                    <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-lg text-xs">
                      {demo.views} views
                    </div>

                    {/* Playing indicator */}
                    {playingDemo === demo.id && (
                      <div className="absolute inset-0 border-4 border-indigo-500 rounded-2xl animate-pulse"></div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {demo.title}
                    </h3>
                    <p className="text-sm text-gray-600">{demo.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isARActive && selectedExperience ? (
          /* Enhanced AR Experience View */
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            <div className="relative bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 h-96 flex items-center justify-center overflow-hidden">
              {/* Animated background elements */}
              <div className="absolute inset-0">
                <div className="absolute top-10 left-10 w-4 h-4 bg-white/20 rounded-full animate-ping"></div>
                <div className="absolute top-20 right-20 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
                <div className="absolute bottom-20 left-20 w-3 h-3 bg-white/25 rounded-full animate-bounce"></div>
                <div className="absolute bottom-10 right-10 w-2 h-2 bg-white/35 rounded-full animate-ping"></div>
              </div>

              <div className="text-center text-white z-10">
                <div className="relative mb-6">
                  <Camera className="h-20 w-20 mx-auto mb-4 opacity-80 animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                </div>
                <h3 className="text-3xl font-bold mb-2 animate-fade-in">AR Experience Active</h3>
                <p className="text-gray-300 mb-2 text-lg">Trying on: {selectedExperience.name}</p>
                <div className="flex items-center justify-center space-x-2 mb-6">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(selectedExperience.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-300">
                    {selectedExperience.rating} ({selectedExperience.reviews} reviews)
                  </span>
                </div>
                
                <div className="flex justify-center space-x-4">
                  <button className="p-4 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200 hover:scale-110 group">
                    <RotateCcw className="h-6 w-6 group-hover:rotate-180 transition-transform duration-300" />
                  </button>
                  <button className="p-4 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200 hover:scale-110">
                    <Share2 className="h-6 w-6" />
                  </button>
                  <button className="p-4 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200 hover:scale-110">
                    <Download className="h-6 w-6" />
                  </button>
                  <button className="p-4 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200 hover:scale-110">
                    <Maximize className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-8 bg-gradient-to-r from-white to-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">{selectedExperience.name}</h3>
                    <button className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-gray-600 mb-4">{selectedExperience.description}</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-3xl font-bold text-indigo-600">${selectedExperience.price}</span>
                      {selectedExperience.originalPrice && (
                        <span className="text-xl text-gray-400 line-through">
                          ${selectedExperience.originalPrice}
                        </span>
                      )}
                    </div>
                    {selectedExperience.originalPrice && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Save ${selectedExperience.originalPrice - selectedExperience.price}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setIsARActive(false)}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:scale-105"
                  >
                    Exit AR
                  </button>
                  <button className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Enhanced Product Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredExperiences.map((experience, index) => (
              <div
                key={experience.id}
                className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group transform hover:scale-105 border border-white/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={experience.image}
                    alt={experience.name}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Hover overlay with enhanced effects */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => startARExperience(experience)}
                        className="bg-white/90 backdrop-blur-sm text-gray-900 px-8 py-3 rounded-2xl font-bold hover:shadow-lg transform hover:scale-110 transition-all duration-200 flex items-center space-x-2"
                      >
                        <Camera className="h-5 w-5" />
                        <span>Try in AR</span>
                      </button>
                    </div>
                  </div>

                  {/* Price badge */}
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    ${experience.price}
                  </div>

                  {/* Discount badge */}
                  {experience.originalPrice && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                      -{Math.round(((experience.originalPrice - experience.price) / experience.originalPrice) * 100)}%
                    </div>
                  )}

                  {/* Heart button */}
                  <button className="absolute bottom-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100">
                    <Heart className="h-4 w-4 text-red-500" />
                  </button>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {experience.name}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{experience.description}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(experience.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {experience.rating} ({experience.reviews})
                    </span>
                  </div>
                  
                  {/* Compatibility badges */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Compatible with:</p>
                    <div className="flex flex-wrap gap-1">
                      {experience.compatibility.map((device, deviceIndex) => (
                        <span
                          key={deviceIndex}
                          className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full border border-indigo-200"
                        >
                          {device}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => startARExperience(experience)}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-2xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Camera className="h-5 w-5" />
                    <span>Launch AR Experience</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced AR Features Info */}
        <div className="mt-20 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-12 border border-white/20 backdrop-blur-md">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 flex items-center justify-center">
              <Sparkles className="h-10 w-10 mr-4 text-indigo-600 animate-pulse" />
              Advanced AR Features
            </h2>
            <p className="text-xl text-gray-600">Powered by cutting-edge WebAR technology for seamless experiences</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Eye,
                title: 'Real-time Tracking',
                description: 'Advanced face and body tracking for accurate virtual try-ons with 99.9% precision',
                color: 'from-blue-500 to-indigo-500'
              },
              {
                icon: Monitor,
                title: 'Smart Mirror Integration',
                description: 'Connect with smart mirrors for full-body try-on experiences in retail stores',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: Share2,
                title: 'Social Sharing',
                description: 'Share AR experiences with friends for feedback and collaborative shopping decisions',
                color: 'from-purple-500 to-pink-500'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center group transform hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`inline-flex p-6 bg-gradient-to-r ${feature.color} rounded-3xl shadow-lg mb-6 group-hover:shadow-2xl transition-all duration-300`}>
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '10M+', label: 'AR Try-Ons' },
              { number: '99.9%', label: 'Accuracy Rate' },
              { number: '50+', label: 'Supported Devices' },
              { number: '24/7', label: 'Available' }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="text-3xl font-bold text-indigo-600 mb-2 group-hover:scale-110 transition-transform duration-200">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 1s ease-out 0.3s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}