import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, ThumbsUp, ThumbsDown, Share2, Plus, Star, Heart, Clock, Send, Eye, Gift } from 'lucide-react';

interface CollaborativeItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  addedBy: string;
  addedAt: Date;
  votes: { up: number; down: number };
  comments: Comment[];
  tags: string[];
  aiReason?: string;
}

interface Comment {
  id: string;
  user: string;
  avatar: string;
  content: string;
  timestamp: Date;
  reactions: { emoji: string; count: number }[];
}

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  lastActive: Date;
}

interface CollaborativeShortlistProps {
  eventId: string;
  eventTitle: string;
  isVisible: boolean;
  onClose: () => void;
}

export function CollaborativeShortlist({ eventId, eventTitle, isVisible, onClose }: CollaborativeShortlistProps) {
  const [items, setItems] = useState<CollaborativeItem[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [newComment, setNewComment] = useState('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Mock data
  const mockItems: CollaborativeItem[] = [
    {
      id: '1',
      name: 'Eco-Friendly Yoga Mat',
      price: 89,
      originalPrice: 120,
      image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      addedBy: 'You',
      addedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      votes: { up: 5, down: 0 },
      comments: [
        {
          id: '1',
          user: 'Sarah',
          avatar: '👩‍💼',
          content: 'Perfect choice! Sarah loves yoga and this is eco-friendly too.',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          reactions: [{ emoji: '👍', count: 3 }, { emoji: '❤️', count: 2 }]
        },
        {
          id: '2',
          user: 'Mike',
          avatar: '👨‍💻',
          content: 'Great price too! I saw this in store for $150.',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          reactions: [{ emoji: '💰', count: 1 }]
        }
      ],
      tags: ['eco-friendly', 'yoga', 'sustainable'],
      aiReason: 'Perfect for Sarah\'s yoga practice. Made from sustainable materials she loves.'
    },
    {
      id: '2',
      name: 'Organic Skincare Set',
      price: 75,
      image: 'https://images.pexels.com/photos/3612181/pexels-photo-3612181.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      addedBy: 'Emma',
      addedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      votes: { up: 4, down: 1 },
      comments: [
        {
          id: '3',
          user: 'Emma',
          avatar: '👩‍🎨',
          content: 'She mentioned wanting to try organic skincare. This brand has amazing reviews!',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          reactions: [{ emoji: '✨', count: 4 }]
        }
      ],
      tags: ['organic', 'skincare', 'natural'],
      aiReason: 'Matches her preference for natural, organic beauty products.'
    }
  ];

  const mockCollaborators: Collaborator[] = [
    { id: '1', name: 'Sarah', avatar: '👩‍💼', status: 'online', lastActive: new Date() },
    { id: '2', name: 'Mike', avatar: '👨‍💻', status: 'online', lastActive: new Date(Date.now() - 5 * 60 * 1000) },
    { id: '3', name: 'Emma', avatar: '👩‍🎨', status: 'offline', lastActive: new Date(Date.now() - 30 * 60 * 1000) },
    { id: '4', name: 'Alex', avatar: '👨‍🎨', status: 'online', lastActive: new Date(Date.now() - 2 * 60 * 1000) }
  ];

  useEffect(() => {
    setItems(mockItems);
    setCollaborators(mockCollaborators);
  }, []);

  const handleVote = (itemId: string, voteType: 'up' | 'down') => {
    setItems(prev => prev.map(item =>
      item.id === itemId
        ? {
            ...item,
            votes: {
              ...item.votes,
              [voteType]: item.votes[voteType] + 1
            }
          }
        : item
    ));
  };

  const addComment = (itemId: string) => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: 'You',
      avatar: '😊',
      content: newComment,
      timestamp: new Date(),
      reactions: []
    };

    setItems(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, comments: [...item.comments, comment] }
        : item
    ));

    setNewComment('');
  };

  const addReaction = (commentId: string, emoji: string) => {
    setItems(prev => prev.map(item => ({
      ...item,
      comments: item.comments.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              reactions: comment.reactions.map(reaction =>
                reaction.emoji === emoji
                  ? { ...reaction, count: reaction.count + 1 }
                  : reaction
              )
            }
          : comment
      )
    })));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Collaborative Gift Planning</h2>
              <p className="text-white/90">{eventTitle}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowInviteModal(true)}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Invite</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Collaborators */}
          <div className="flex items-center space-x-4 mt-4">
            <span className="text-sm text-white/80">Collaborators:</span>
            <div className="flex space-x-2">
              {collaborators.map((collaborator) => (
                <div key={collaborator.id} className="relative group">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-lg">
                    {collaborator.avatar}
                  </div>
                  {collaborator.status === 'online' && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  )}
                  <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {collaborator.name} ({collaborator.status})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[70vh]">
          {/* Items List */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex gap-6">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-xl font-bold text-purple-600">${item.price}</span>
                            {item.originalPrice && (
                              <span className="text-gray-400 line-through">${item.originalPrice}</span>
                            )}
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600 ml-1">{item.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>Added by {item.addedBy}</span>
                            <span>•</span>
                            <span>{item.addedAt.toLocaleTimeString()}</span>
                          </div>
                        </div>
                        
                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                          <Heart className="h-5 w-5" />
                        </button>
                      </div>

                      {/* AI Reason */}
                      {item.aiReason && (
                        <div className="bg-purple-50 p-3 rounded-lg mb-3">
                          <div className="flex items-start space-x-2">
                            <Gift className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-purple-800">{item.aiReason}</p>
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Voting */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleVote(item.id, 'up')}
                            className="flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            <ThumbsUp className="h-4 w-4" />
                            <span>{item.votes.up}</span>
                          </button>
                          <button
                            onClick={() => handleVote(item.id, 'down')}
                            className="flex items-center space-x-1 px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <ThumbsDown className="h-4 w-4" />
                            <span>{item.votes.down}</span>
                          </button>
                          <button
                            onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                            className="flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span>{item.comments.length}</span>
                          </button>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button className="px-4 py-2 border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                            <Eye className="h-4 w-4 inline mr-1" />
                            View
                          </button>
                          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                            Add to Cart
                          </button>
                        </div>
                      </div>

                      {/* Comments Section */}
                      {selectedItem === item.id && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <div className="space-y-4 mb-4">
                            {item.comments.map((comment) => (
                              <div key={comment.id} className="flex space-x-3">
                                <div className="text-2xl">{comment.avatar}</div>
                                <div className="flex-1">
                                  <div className="bg-gray-100 rounded-lg p-3">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <span className="font-medium text-gray-900">{comment.user}</span>
                                      <span className="text-xs text-gray-500">
                                        {comment.timestamp.toLocaleTimeString()}
                                      </span>
                                    </div>
                                    <p className="text-gray-700">{comment.content}</p>
                                  </div>
                                  
                                  {/* Reactions */}
                                  <div className="flex items-center space-x-2 mt-2">
                                    {comment.reactions.map((reaction, index) => (
                                      <button
                                        key={index}
                                        onClick={() => addReaction(comment.id, reaction.emoji)}
                                        className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-sm"
                                      >
                                        <span>{reaction.emoji}</span>
                                        <span>{reaction.count}</span>
                                      </button>
                                    ))}
                                    <button className="text-gray-400 hover:text-gray-600 text-sm">
                                      + React
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Add Comment */}
                          <div className="flex space-x-3">
                            <div className="text-2xl">😊</div>
                            <div className="flex-1 flex space-x-2">
                              <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                onKeyPress={(e) => e.key === 'Enter' && addComment(item.id)}
                              />
                              <button
                                onClick={() => addComment(item.id)}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                              >
                                <Send className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="w-80 border-l border-gray-200 p-6 bg-gray-50">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Recent Activity
            </h3>
            
            <div className="space-y-4">
              {[
                { user: 'Emma', action: 'added Organic Skincare Set', time: '4h ago', avatar: '👩‍🎨' },
                { user: 'Mike', action: 'voted up Yoga Mat', time: '2h ago', avatar: '👨‍💻' },
                { user: 'Sarah', action: 'commented on Yoga Mat', time: '30m ago', avatar: '👩‍💼' },
                { user: 'You', action: 'added Yoga Mat', time: '2h ago', avatar: '😊' }
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                  <div className="text-lg">{activity.avatar}</div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {items.length} items • {collaborators.filter(c => c.status === 'online').length} online
            </div>
            <div className="flex space-x-3">
              <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                Export List
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
                <Share2 className="h-4 w-4" />
                <span>Share Shortlist</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}