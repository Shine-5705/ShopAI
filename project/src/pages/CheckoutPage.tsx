import React, { useState } from 'react';
import { ShoppingCart, CreditCard, Truck, Clock, Gift, TrendingDown, Package, Lightbulb } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  estimatedDelivery: string;
}

interface SmartTip {
  type: 'savings' | 'delivery' | 'bundle' | 'sustainability';
  title: string;
  description: string;
  savings?: number;
  icon: React.ComponentType<any>;
}

export function CheckoutPage() {
  const [cartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Cozy Knit Sweater',
      price: 89,
      quantity: 1,
      image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=400',
      estimatedDelivery: 'Tomorrow'
    },
    {
      id: '2',
      name: 'Smart Fitness Tracker',
      price: 199,
      quantity: 1,
      image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',
      estimatedDelivery: '2-3 days'
    }
  ]);

  const [smartTips] = useState<SmartTip[]>([
    {
      type: 'bundle',
      title: 'Bundle & Save',
      description: 'Add matching accessories for 15% off your entire order',
      savings: 43,
      icon: Package
    },
    {
      type: 'delivery',
      title: 'Optimize Delivery',
      description: 'Combine with next week\'s order to reduce carbon footprint',
      icon: Truck
    },
    {
      type: 'savings',
      title: 'Price Drop Alert',
      description: 'The fitness tracker dropped $20 since you added it!',
      savings: 20,
      icon: TrendingDown
    }
  ]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const shipping = 0; // Free shipping
  const total = subtotal + tax + shipping;

  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Smart Tips */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <Lightbulb className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900">Smart Savings Tips</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {smartTips.map((tip, index) => (
                  <div key={index} className="bg-white p-4 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-indigo-50 rounded-lg">
                        <tip.icon className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{tip.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{tip.description}</p>
                        {tip.savings && (
                          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Save ${tip.savings}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Items */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex items-center space-x-2 mb-6">
                <ShoppingCart className="h-5 w-5 text-indigo-600" />
                <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
              </div>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-lg font-bold text-indigo-600">${item.price}</span>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{item.estimatedDelivery}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <select
                        value={item.quantity}
                        className="px-3 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping & Payment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Shipping */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Shipping Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue="Alex Johnson"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      defaultValue="123 Main St, Seattle, WA 98101"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        defaultValue="Seattle"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                      <input
                        type="text"
                        defaultValue="98101"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border-2 border-indigo-500 bg-indigo-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-indigo-600" />
                      <div>
                        <p className="font-semibold text-gray-900">•••• •••• •••• 4242</p>
                        <p className="text-sm text-gray-600">Expires 12/26</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">Selected</span>
                  </div>
                  
                  <button className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors">
                    + Add New Payment Method
                  </button>

                  <div className="flex items-center space-x-2 mt-4">
                    <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    <span className="text-sm text-gray-600">Save this payment method for future purchases</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Truck className="h-4 w-4 text-green-500" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Gift className="h-4 w-4 text-purple-500" />
                  <span>Gift wrapping available</span>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                Complete Order
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By completing your order, you agree to our terms and conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}