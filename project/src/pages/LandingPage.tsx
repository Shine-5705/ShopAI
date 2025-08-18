import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Mic, Sparkles, TrendingUp, Users, Shield, ArrowRight, Zap, Heart, Star, Gift, Camera, Play } from 'lucide-react';

export function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0, 0]);

  const handleVoiceSearch = () => {
    setIsListening(!isListening);
    // Voice search logic would go here
  };

  const categories = [
    { name: 'Fashion & Style', color: 'from-pink-400 to-red-400', items: '2.5M+', icon: '👗' },
    { name: 'Electronics', color: 'from-blue-400 to-indigo-400', items: '850K+', icon: '📱' },
    { name: 'Home & Garden', color: 'from-green-400 to-emerald-400', items: '1.2M+', icon: '🏠' },
    { name: 'Health & Beauty', color: 'from-purple-400 to-pink-400', items: '650K+', icon: '💄' },
    { name: 'Sports & Outdoors', color: 'from-orange-400 to-red-400', items: '420K+', icon: '⚽' },
    { name: 'Books & Media', color: 'from-indigo-400 to-purple-400', items: '320K+', icon: '📚' },
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Recommendations',
      description: 'Get personalized suggestions based on your preferences, mood, and context.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: TrendingUp,
      title: 'Smart Price Tracking',
      description: 'Never miss a deal with intelligent price monitoring and alerts.',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: Users,
      title: 'Social Shopping',
      description: 'Share shortlists with friends and family for collaborative decision-making.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is secure and used only to enhance your shopping experience.',
      color: 'from-orange-500 to-red-500'
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Fashion Enthusiast',
      content: 'ShopAI completely transformed how I shop! The AR try-on feature saved me from so many returns.',
      avatar: '👩‍💼',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Tech Professional',
      content: 'The contextual recommendations are spot-on. It knows exactly what I need before I do!',
      avatar: '👨‍💻',
      rating: 5
    },
    {
      name: 'Emma Davis',
      role: 'Interior Designer',
      content: 'The furniture AR placement feature is a game-changer for my clients. Absolutely love it!',
      avatar: '👩‍🎨',
      rating: 5
    }
  ];

  const stats = [
    { number: 2500000, label: 'Happy Customers', suffix: '+' },
    { number: 98, label: 'Satisfaction Rate', suffix: '%' },
    { number: 15, label: 'Million Products', suffix: 'M+' },
    { number: 24, label: 'Hour Support', suffix: '/7' }
  ];

  // Animate stats on mount
  useEffect(() => {
    const animateStats = () => {
      stats.forEach((stat, index) => {
        let current = 0;
        const increment = stat.number / 100;
        const timer = setInterval(() => {
          current += increment;
          if (current >= stat.number) {
            current = stat.number;
            clearInterval(timer);
          }
          setAnimatedStats(prev => {
            const newStats = [...prev];
            newStats[index] = Math.floor(current);
            return newStats;
          });
        }, 20);
      });
    };

    const timer = setTimeout(animateStats, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-32">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-pink-400 to-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Animated title */}
            <div className="mb-8">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-4 animate-fade-in-up">
                Shop Smarter with{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
                  AI Intelligence
                </span>
              </h1>
              <div className="flex justify-center items-center space-x-2 mb-8">
                <Sparkles className="h-8 w-8 text-indigo-500 animate-pulse" />
                <span className="text-2xl animate-bounce">✨</span>
                <Zap className="h-8 w-8 text-purple-500 animate-pulse" />
              </div>
            </div>

            <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up animation-delay-300">
              Discover the perfect products tailored to your lifestyle, budget, and preferences. 
              Our AI considers your mood, weather, calendar, and more to deliver contextual shopping experiences that feel magical.
            </p>

            {/* Enhanced Search Bar */}
            <div className="max-w-3xl mx-auto mb-12 animate-fade-in-up animation-delay-600">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500 animate-pulse"></div>
                <div className="relative bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 p-3">
                  <div className="flex items-center">
                    <Search className="h-6 w-6 text-gray-400 ml-6" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="What's on your wishlist today? ✨"
                      className="flex-1 px-6 py-5 text-lg border-none outline-none bg-transparent placeholder-gray-500"
                    />
                    <button
                      onClick={handleVoiceSearch}
                      className={`p-4 rounded-2xl mr-3 transition-all duration-300 transform hover:scale-110 ${
                        isListening
                          ? 'bg-red-500 text-white animate-pulse shadow-lg'
                          : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg'
                      }`}
                    >
                      <Mic className="h-6 w-6" />
                    </button>
                    <Link
                      to="/discover"
                      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-10 py-4 rounded-2xl font-bold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                    >
                      <span>Discover Magic</span>
                      <Sparkles className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Quick Actions */}
            <div className="flex flex-wrap justify-center gap-4 mb-16 animate-fade-in-up animation-delay-900">
              {[
                { to: '/ar-tryons', label: 'Try AR Magic', icon: Camera, color: 'from-purple-500 to-pink-500' },
                { to: '/shortlist', label: 'My Wishlist', icon: Heart, color: 'from-red-500 to-pink-500' },
                { to: '/discover', label: 'Trending Now', icon: TrendingUp, color: 'from-blue-500 to-indigo-500' },
                { to: '/profile', label: 'Personalize', icon: Users, color: 'from-green-500 to-emerald-500' }
              ].map((action, index) => (
                <Link
                  key={index}
                  to={action.to}
                  className={`bg-gradient-to-r ${action.color} text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl border border-white/20 hover:scale-105 transition-all duration-300 flex items-center space-x-2 backdrop-blur-md`}
                  style={{ animationDelay: `${1200 + index * 100}ms` }}
                >
                  <action.icon className="h-5 w-5" />
                  <span className="font-medium">{action.label}</span>
                </Link>
              ))}
            </div>

            {/* Animated Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in-up animation-delay-1200">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                    {animatedStats[index]?.toLocaleString()}{stat.suffix}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Smart Categories */}
      <section className="py-24 bg-gradient-to-r from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 animate-fade-in-up">
              Explore Smart Categories
            </h2>
            <p className="text-xl text-gray-600 animate-fade-in-up animation-delay-200">
              AI-curated collections that adapt to your preferences and context
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                to="/discover"
                className="group relative overflow-hidden rounded-3xl p-8 h-40 flex items-center justify-center transform hover:scale-105 transition-all duration-500 hover:shadow-2xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-90 group-hover:opacity-100 transition-all duration-300`}></div>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-300"></div>
                
                {/* Animated background elements */}
                <div className="absolute top-4 right-4 text-4xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 group-hover:animate-bounce">
                  {category.icon}
                </div>
                
                <div className="relative text-center text-white z-10">
                  <h3 className="text-xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                    {category.name}
                  </h3>
                  <p className="text-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                    {category.items} products
                  </p>
                </div>
                
                <ArrowRight className="absolute right-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features */}
      <section className="py-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 animate-fade-in-up">
              Why Choose ShopAI?
            </h2>
            <p className="text-xl text-gray-600 animate-fade-in-up animation-delay-200">
              Experience the future of personalized shopping
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 text-center group border border-white/50 hover:scale-105"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`inline-flex p-6 bg-gradient-to-r ${feature.color} rounded-3xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600">Join millions of happy shoppers</p>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 md:p-12 text-center">
              <div className="text-6xl mb-6 animate-bounce">
                {testimonials[currentTestimonial].avatar}
              </div>
              
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-xl text-gray-700 mb-6 italic leading-relaxed">
                "{testimonials[currentTestimonial].content}"
              </blockquote>
              
              <div>
                <div className="font-bold text-gray-900 text-lg">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="text-gray-600">
                  {testimonials[currentTestimonial].role}
                </div>
              </div>
            </div>

            {/* Testimonial indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'bg-indigo-500 scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full animate-float animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-float animation-delay-4000"></div>
          <div className="absolute bottom-40 right-1/3 w-8 h-8 bg-white/10 rounded-full animate-float animation-delay-1000"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-8">
            <Sparkles className="h-16 w-16 mx-auto mb-6 animate-pulse" />
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 animate-fade-in-up">
              Ready to Transform Your Shopping Experience?
            </h2>
            <p className="text-xl mb-10 opacity-90 animate-fade-in-up animation-delay-300">
              Join millions of smart shoppers who save time and money with our AI assistant.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-600">
            <Link
              to="/discover"
              className="inline-flex items-center space-x-3 bg-white text-indigo-600 px-10 py-5 rounded-2xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg"
            >
              <span>Start Shopping Smart</span>
              <ArrowRight className="h-6 w-6" />
            </Link>
            
            <Link
              to="/ar-tryons"
              className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur-md text-white px-10 py-5 rounded-2xl font-bold hover:bg-white/30 transform hover:scale-105 transition-all duration-300 text-lg border border-white/30"
            >
              <Play className="h-6 w-6" />
              <span>Watch Demo</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-size: 200% 200%; background-position: left center; }
          50% { background-size: 200% 200%; background-position: right center; }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-blob { animation: blob 7s infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-gradient-x { animation: gradient-x 3s ease infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; opacity: 0; }
        
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-600 { animation-delay: 600ms; }
        .animation-delay-900 { animation-delay: 900ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
        .animation-delay-1200 { animation-delay: 1200ms; }
        .animation-delay-2000 { animation-delay: 2000ms; }
        .animation-delay-4000 { animation-delay: 4000ms; }
      `}</style>
    </div>
  );
}