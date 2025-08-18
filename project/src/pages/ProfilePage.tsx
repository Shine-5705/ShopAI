import React, { useState } from 'react';
import { User, Settings, Bell, Shield, CreditCard, Calendar, Smartphone, Palette, TrendingUp } from 'lucide-react';

interface Preference {
  id: string;
  name: string;
  value: string | boolean | number;
  type: 'text' | 'boolean' | 'select' | 'range';
  options?: string[];
}

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [preferences, setPreferences] = useState<Preference[]>([
    { id: 'style', name: 'Preferred Style', value: 'Modern', type: 'select', options: ['Modern', 'Classic', 'Trendy', 'Minimalist'] },
    { id: 'budget', name: 'Average Budget', value: 200, type: 'range' },
    { id: 'notifications', name: 'Price Drop Alerts', value: true, type: 'boolean' },
    { id: 'sustainability', name: 'Eco-friendly Products', value: true, type: 'boolean' },
    { id: 'size', name: 'Clothing Size', value: 'M', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  ]);

  const [connectedDevices] = useState([
    { name: 'iPhone 13', type: 'Mobile', connected: true, lastSync: '2 minutes ago' },
    { name: 'Smart Mirror', type: 'AR Device', connected: true, lastSync: '1 hour ago' },
    { name: 'Apple Watch', type: 'Wearable', connected: false, lastSync: 'Never' },
    { name: 'Home Assistant', type: 'Smart Home', connected: true, lastSync: '5 minutes ago' },
  ]);

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'preferences', name: 'Preferences', icon: Settings },
    { id: 'devices', name: 'Connected Devices', icon: Smartphone },
    { id: 'privacy', name: 'Privacy & Security', icon: Shield },
    { id: 'billing', name: 'Billing', icon: CreditCard },
  ];

  const updatePreference = (id: string, value: any) => {
    setPreferences(prev => prev.map(pref => 
      pref.id === id ? { ...pref, value } : pref
    ));
  };

  const renderPreferenceInput = (pref: Preference) => {
    switch (pref.type) {
      case 'boolean':
        return (
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={pref.value as boolean}
              onChange={(e) => updatePreference(pref.id, e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-600">Enable</span>
          </label>
        );
      case 'select':
        return (
          <select
            value={pref.value as string}
            onChange={(e) => updatePreference(pref.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {pref.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'range':
        return (
          <div>
            <input
              type="range"
              min="0"
              max="1000"
              value={pref.value as number}
              onChange={(e) => updatePreference(pref.id, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>$0</span>
              <span className="font-medium">${pref.value}</span>
              <span>$1000+</span>
            </div>
          </div>
        );
      default:
        return (
          <input
            type="text"
            value={pref.value as string}
            onChange={(e) => updatePreference(pref.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        );
    }
  };

  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Alex Johnson</h2>
                <p className="text-gray-600">alex.johnson@email.com</p>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-indigo-50 text-indigo-600 border-r-2 border-indigo-600'
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue="Alex Johnson"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="alex.johnson@email.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      defaultValue="+1 (555) 123-4567"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      defaultValue="Seattle, WA"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <button className="mt-6 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200">
                  Save Changes
                </button>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Shopping Preferences</h2>
                <div className="space-y-6">
                  {preferences.map((pref) => (
                    <div key={pref.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        {pref.name}
                      </label>
                      {renderPreferenceInput(pref)}
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Personalization</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <TrendingUp className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                      <h4 className="font-medium text-gray-900">Smart Suggestions</h4>
                      <p className="text-sm text-gray-600">Based on your behavior and preferences</p>
                    </div>
                    <div className="text-center">
                      <Calendar className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                      <h4 className="font-medium text-gray-900">Context Awareness</h4>
                      <p className="text-sm text-gray-600">Calendar events and weather integration</p>
                    </div>
                    <div className="text-center">
                      <Palette className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                      <h4 className="font-medium text-gray-900">Style Learning</h4>
                      <p className="text-sm text-gray-600">Adapts to your evolving taste</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'devices' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Connected Devices</h2>
                <div className="space-y-4">
                  {connectedDevices.map((device, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${device.connected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{device.name}</h3>
                          <p className="text-sm text-gray-600">{device.type} • Last sync: {device.lastSync}</p>
                        </div>
                      </div>
                      <button className={`px-4 py-2 rounded-lg transition-colors ${
                        device.connected
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                      }`}>
                        {device.connected ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Device</h3>
                  <p className="text-gray-600 mb-4">Connect more devices to enhance your shopping experience</p>
                  <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200">
                    Add Device
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy & Security</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div>
                      <h3 className="font-semibold text-gray-900">Data Sharing</h3>
                      <p className="text-sm text-gray-600">Allow anonymous data sharing to improve AI recommendations</p>
                    </div>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div>
                      <h3 className="font-semibold text-gray-900">Location Services</h3>
                      <p className="text-sm text-gray-600">Use location for local deals and store recommendations</p>
                    </div>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div>
                      <h3 className="font-semibold text-gray-900">Calendar Integration</h3>
                      <p className="text-sm text-gray-600">Access calendar events for contextual recommendations</p>
                    </div>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    </label>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-red-50 rounded-xl">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">Delete Account</h3>
                  <p className="text-red-700 mb-4">Permanently delete your account and all associated data</p>
                  <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing & Payments</h2>
                
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">VISA</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">•••• •••• •••• 4242</p>
                          <p className="text-sm text-gray-600">Expires 12/26</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Default</span>
                    </div>
                  </div>
                  <button className="mt-4 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Add Payment Method
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
                  <div className="space-y-3">
                    {[
                      { item: 'Cozy Knit Sweater', amount: 89, date: '2024-01-20' },
                      { item: 'Smart Fitness Tracker', amount: 199, date: '2024-01-18' },
                      { item: 'Modern Table Lamp', amount: 79, date: '2024-01-15' },
                    ].map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-900">{transaction.item}</p>
                          <p className="text-sm text-gray-600">{transaction.date}</p>
                        </div>
                        <p className="font-semibold text-gray-900">${transaction.amount}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}