import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './components/AuthProvider';
import { Navigation } from './components/Navigation';
import { AIChat } from './components/AIChat';
import { ContextualAssistant } from './components/ContextualAssistant';
import { SmartNotificationCenter } from './components/SmartNotificationCenter';
import { CollaborativeShortlist } from './components/CollaborativeShortlist';
import { LoginModal } from './components/LoginModal';
import { LandingPage } from './pages/LandingPage';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { ARPage } from './pages/ARPage';
import { ProfilePage } from './pages/ProfilePage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ShortlistPage } from './pages/ShortlistPage';
import { useAuthStore } from './store/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [showCollaborativeShortlist, setShowCollaborativeShortlist] = useState(false);
  const { user } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <Navigation 
              onLoginClick={() => setShowLoginModal(true)}
              onNotificationClick={() => setShowNotificationCenter(true)}
            />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/discover" element={<DiscoveryPage />} />
              <Route path="/ar-tryons" element={<ARPage />} />
              <Route path="/shortlist" element={<ShortlistPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
            </Routes>
            
            {/* Enhanced AI Chat */}
            <AIChat />
            
            {/* Context-Aware Assistant */}
            <ContextualAssistant />
            
            {/* Smart Notification Center */}
            <SmartNotificationCenter 
              isOpen={showNotificationCenter}
              onClose={() => setShowNotificationCenter(false)}
            />
            
            {/* Collaborative Shortlist Modal */}
            <CollaborativeShortlist
              eventId="birthday-sarah"
              eventTitle="Sarah's Birthday Gift Planning"
              isVisible={showCollaborativeShortlist}
              onClose={() => setShowCollaborativeShortlist(false)}
            />
            
            {/* Login Modal */}
            <LoginModal 
              isOpen={showLoginModal} 
              onClose={() => setShowLoginModal(false)} 
            />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;