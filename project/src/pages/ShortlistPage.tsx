import React, { useState } from 'react';
import { Plus, Users, MessageCircle, ThumbsUp, ThumbsDown, Share2, Trash2, Star } from 'lucide-react';

interface ShortlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  votes: { up: number; down: number };
  comments: Comment[];
  addedBy: string;
}

interface Shortlist {
  id: string;
  name: string;
  description: string;
  items: ShortlistItem[];
  collaborators: string[];
  isPublic: boolean;
  createdAt: Date;
}

interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: Date;
}

export function ShortlistPage() {
  const [shortlists, setShortlists] = useState<Shortlist[]>([
    {
      id: '1',
      name: 'Weekend Outfits',
      description: 'Casual looks for the weekend',
      items: [
        {
          id: '1',
          name: 'Cozy Knit Sweater',
          price: 89,
          image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=400',
          votes: { up: 3, down: 0 },
          comments: [
            { id: '1', user: 'Sarah', text: 'Love this color!', timestamp: new Date() },
            { id: '2', user: 'Mike', text: 'Perfect for fall weather', timestamp: new Date() }
          ],
          addedBy: 'You'
        },
        {
          id: '2',
          name: 'Casual Jeans',
          price: 79,
          image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400',
          votes: { up: 2, down: 1 },
          comments: [],
          addedBy: 'Sarah'
        }
      ],
      collaborators: ['Sarah', 'Mike', 'Emma'],
      isPublic: false,
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Office Setup',
      description: 'Items for the home office upgrade',
      items: [
        {
          id: '3',
          name: 'Ergonomic Chair',
          price: 299,
          image: 'https://images.pexels.com/photos/447592/pexels-photo-447592.jpeg?auto=compress&cs=tinysrgb&w=400',
          votes: { up: 4, down: 0 },
          comments: [
            { id: '3', user: 'Alex', text: 'This has great reviews for back support', timestamp: new Date() }
          ],
          addedBy: 'Alex'
        }
      ],
      collaborators: ['Alex', 'Taylor'],
      isPublic: true,
      createdAt: new Date('2024-01-10')
    }
  ]);

  const [selectedShortlist, setSelectedShortlist] = useState<Shortlist | null>(shortlists[0]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleVote = (itemId: string, voteType: 'up' | 'down') => {
    if (!selectedShortlist) return;

    setShortlists(prev => prev.map(shortlist =>
      shortlist.id === selectedShortlist.id
        ? {
            ...shortlist,
            items: shortlist.items.map(item =>
              item.id === itemId
                ? {
                    ...item,
                    votes: {
                      ...item.votes,
                      [voteType]: item.votes[voteType] + 1
                    }
                  }
                : item
            )
          }
        : shortlist
    ));

    setSelectedShortlist(prev => prev ? {
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId
          ? {
              ...item,
              votes: {
                ...item.votes,
                [voteType]: item.votes[voteType] + 1
              }
            }
          : item
      )
    } : null);
  };

  const addComment = (itemId: string) => {
    if (!newComment.trim() || !selectedShortlist) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: 'You',
      text: newComment,
      timestamp: new Date()
    };

    setShortlists(prev => prev.map(shortlist =>
      shortlist.id === selectedShortlist.id
        ? {
            ...shortlist,
            items: shortlist.items.map(item =>
              item.id === itemId
                ? { ...item, comments: [...item.comments, comment] }
                : item
            )
          }
        : shortlist
    ));

    setSelectedShortlist(prev => prev ? {
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId
          ? { ...item, comments: [...item.comments, comment] }
          : item
      )
    } : null);

    setNewComment('');
  };

  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Shortlists Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Shortlists</h2>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                {shortlists.map((shortlist) => (
                  <button
                    key={shortlist.id}
                    onClick={() => setSelectedShortlist(shortlist)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedShortlist?.id === shortlist.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{shortlist.name}</h3>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Users className="h-3 w-3" />
                        <span>{shortlist.collaborators.length}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{shortlist.description}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{shortlist.items.length} items</span>
                      <span>{shortlist.isPublic ? 'Public' : 'Private'}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Shortlist Content */}
          <div className="flex-1">
            {selectedShortlist ? (
              <div>
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedShortlist.name}
                      </h1>
                      <p className="text-gray-600 mb-4">{selectedShortlist.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{selectedShortlist.collaborators.length} collaborators</span>
                        </div>
                        <div>{selectedShortlist.items.length} items</div>
                        <div>{selectedShortlist.isPublic ? 'Public' : 'Private'}</div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowInviteModal(true)}
                        className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        <Users className="h-4 w-4 inline mr-1" />
                        Invite
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                        <Share2 className="h-4 w-4 inline mr-1" />
                        Share
                      </button>
                    </div>
                  </div>

                  {/* Collaborators */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Collaborators:</span>
                      <div className="flex space-x-2">
                        {selectedShortlist.collaborators.map((collaborator, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium"
                          >
                            {collaborator[0]}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-6">
                  {selectedShortlist.items.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                      <div className="p-6">
                        <div className="flex gap-6">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-24 h-24 object-cover rounded-xl"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                  {item.name}
                                </h3>
                                <p className="text-xl font-bold text-indigo-600 mb-2">
                                  ${item.price}
                                </p>
                                <p className="text-sm text-gray-500">Added by {item.addedBy}</p>
                              </div>
                              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            {/* Voting */}
                            <div className="flex items-center space-x-4 mt-4">
                              <div className="flex items-center space-x-2">
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
                              </div>
                              <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200">
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Comments */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <div className="space-y-3 mb-4">
                            {item.comments.map((comment) => (
                              <div key={comment.id} className="flex space-x-3">
                                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium">
                                  {comment.user[0]}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium text-gray-900">{comment.user}</span>
                                    <span className="text-xs text-gray-500">
                                      {comment.timestamp.toLocaleTimeString()}
                                    </span>
                                  </div>
                                  <p className="text-gray-700">{comment.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex space-x-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium">
                              Y
                            </div>
                            <div className="flex-1 flex space-x-2">
                              <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                onKeyPress={(e) => e.key === 'Enter' && addComment(item.id)}
                              />
                              <button
                                onClick={() => addComment(item.id)}
                                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                              >
                                <MessageCircle className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">No shortlist selected</h2>
                <p className="text-gray-600">Select a shortlist from the sidebar to view items</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}