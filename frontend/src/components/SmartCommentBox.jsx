// src/components/SmartCommentBox.jsx
import { useState, useEffect, useCallback } from 'react';
import aiService from '../services/aiService';

const SmartCommentBox = ({ onSubmit, placeholder = "Add comment..." }) => {
  const [comment, setComment] = useState('');
  const [moderation, setModeration] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const checkComment = useCallback(async () => {
    if (!aiService.isEnabled || !comment.trim()) return;

    setIsChecking(true);
    try {
      const [moderationResult, improvementSuggestions] = await Promise.all([
        aiService.moderateComment(comment),
        aiService.suggestCommentImprovement(comment)
      ]);

      setModeration(moderationResult);
      setSuggestions(improvementSuggestions);
      setShowWarning(!moderationResult.approved);
    } catch (error) {
      console.error('Error checking comment:', error);
    } finally {
      setIsChecking(false);
    }
  }, [comment]);

  // Check comment as user types (debounced)
  useEffect(() => {
    if (!comment.trim()) {
      setModeration(null);
      setSuggestions([]);
      setShowWarning(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      checkComment();
    }, 1000); // Wait 1 second after user stops typing

    return () => clearTimeout(timeoutId);
  }, [comment, checkComment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) return;

    // Final moderation check before submission
    if (aiService.isEnabled) {
      const finalCheck = await aiService.moderateComment(comment);
      if (!finalCheck.approved) {
        setShowWarning(true);
        return;
      }
    }

    onSubmit(comment);
    setComment('');
    setModeration(null);
    setSuggestions([]);
    setShowWarning(false);
  };

  const getStatusColor = () => {
    if (!moderation) return 'border-gray-300';
    if (moderation.approved) return 'border-green-300';
    return 'border-red-300';
  };

  const getStatusIcon = () => {
    if (isChecking) return '⏳';
    if (!moderation) return '';
    if (moderation.approved) return '✅';
    return '⚠️';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <div className={`flex space-x-2 border rounded-lg ${getStatusColor()} transition-colors`}>
          <input
            type="text"
            placeholder={placeholder}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1 px-3 py-2 border-0 rounded-l-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
          <div className="flex items-center px-2">
            <span className="text-sm">{getStatusIcon()}</span>
          </div>
          <button
            type="submit"
            disabled={showWarning || isChecking}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Comment
          </button>
        </div>

        {/* Character count */}
        <div className="absolute right-2 -bottom-5 text-xs text-gray-500">
          {comment.length}/1000
        </div>
      </div>

      {/* Moderation warning */}
      {showWarning && moderation && !moderation.approved && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <span className="text-red-500">⚠️</span>
            <div>
              <p className="text-red-700 text-sm font-medium">Comment blocked</p>
              <p className="text-red-600 text-sm">{moderation.reason}</p>
              <button
                type="button"
                onClick={() => setShowWarning(false)}
                className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
              >
                Edit comment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI suggestions */}
      {suggestions.length > 0 && !showWarning && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <span className="text-blue-500">💡</span>
            <div>
              <p className="text-blue-700 text-sm font-medium">Suggestions to improve your comment:</p>
              <ul className="mt-1 space-y-1">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="text-blue-600 text-sm">
                    • {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Quality indicator */}
      {moderation && moderation.approved && !isChecking && (
        <div className="flex items-center space-x-2 text-sm text-green-600">
          <span>✅</span>
          <span>Comment looks good!</span>
          {moderation.confidence && (
            <span className="text-gray-500">
              (Confidence: {Math.round(moderation.confidence * 100)}%)
            </span>
          )}
        </div>
      )}

      {/* Loading indicator */}
      {isChecking && (
        <div className="flex items-center space-x-2 text-sm text-blue-600">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
          <span>Checking comment...</span>
        </div>
      )}
    </form>
  );
};

export default SmartCommentBox;
