// src/components/BlogCard.jsx
import React, { useState } from 'react';

const BlogCard = ({ 
  blog, 
  profile, 
  editing, 
  onEdit, 
  onSaveEdit, 
  onCancelEdit, 
  onDelete, 
  onLike,
  children 
}) => {
  const [isLiking, setIsLiking] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  
  const isAuthor = profile && blog.author?._id === profile._id;
  const editingThis = editing[blog._id];
  const isLiked = profile && blog.likes.includes(profile._id);
  
  const handleLike = async () => {
    setIsLiking(true);
    try {
      await onLike(blog._id);
    } finally {
      setIsLiking(false);
    }
  };

  const truncateContent = (content, maxLength = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        {/* Author and Date */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {blog.author?.username?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{blog.author?.username}</p>
            <p className="text-sm text-gray-500">{formatDate(blog.createdAt)}</p>
          </div>
          {isAuthor && (
            <span className="ml-auto px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              Your post
            </span>
          )}
        </div>

        {/* Title & Content or Edit Form */}
        {editingThis ? (
          <div className="space-y-4">
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
              value={editingThis.title}
              onChange={(e) =>
                onEdit(blog._id, { ...editingThis, title: e.target.value })
              }
              placeholder="Post title..."
            />
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="4"
              value={editingThis.content}
              onChange={(e) =>
                onEdit(blog._id, { ...editingThis, content: e.target.value })
              }
              placeholder="What's on your mind?"
            />
            <div className="flex space-x-2">
              <button
                onClick={() => onSaveEdit(blog._id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Save Changes
              </button>
              <button
                onClick={() => onCancelEdit(blog._id)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
              {blog.title}
            </h2>
            <div className="text-gray-700 leading-relaxed">
              {showFullContent ? (
                <p className="whitespace-pre-wrap">{blog.content}</p>
              ) : (
                <p className="whitespace-pre-wrap">{truncateContent(blog.content)}</p>
              )}
              {blog.content.length > 200 && (
                <button
                  onClick={() => setShowFullContent(!showFullContent)}
                  className="text-blue-600 hover:text-blue-800 font-medium mt-2 text-sm"
                >
                  {showFullContent ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        {!editingThis && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                disabled={isLiking}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isLiked
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className={isLiking ? 'animate-pulse' : ''}>
                  {isLiked ? '❤️' : '🤍'}
                </span>
                <span className="font-medium">{blog.likes.length}</span>
              </button>
              
              <div className="flex items-center space-x-2 text-gray-600">
                <span>💬</span>
                <span className="font-medium">{blog.comments.length}</span>
              </div>
            </div>

            {isAuthor && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEdit(blog._id, { title: blog.title, content: blog.content })}
                  className="px-3 py-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors font-medium"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => onDelete(blog._id)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        )}

        {/* Comments Section */}
        {children}
      </div>
    </article>
  );
};

export default BlogCard;
