// src/components/AIContentAssistant.jsx
import React, { useState, useEffect, useCallback } from 'react';
import aiService from '../services/aiService';

const AIContentAssistant = ({ title, content, onTitleSuggestion }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [titleSuggestions, setTitleSuggestions] = useState([]);
  const [qualityAnalysis, setQualityAnalysis] = useState(null);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('suggestions');

  const generateSuggestions = useCallback(async () => {
    if (!aiService.isEnabled) return;

    setLoading(true);
    try {
      const contentSuggestions = await aiService.generateContentSuggestions(title);
      setSuggestions(contentSuggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setLoading(false);
    }
  }, [title]);

  const generateTitleSuggestions = async () => {
    if (!content || !aiService.isEnabled) return;
    
    setLoading(true);
    try {
      const suggestions = await aiService.generateTitleSuggestions(content);
      setTitleSuggestions(suggestions);
    } catch (error) {
      console.error('Error generating title suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeContent = useCallback(async () => {
    if (!aiService.isEnabled) return;

    try {
      const analysis = await aiService.analyzeContentQuality(title, content);
      setQualityAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing content:', error);
    }
  }, [title, content]);

  const generateTags = useCallback(async () => {
    if (!aiService.isEnabled) return;

    try {
      const generatedTags = await aiService.generateTags(title, content);
      setTags(generatedTags);
    } catch (error) {
      console.error('Error generating tags:', error);
    }
  }, [title, content]);

  // Generate suggestions when title changes
  useEffect(() => {
    if (title && title.length > 3) {
      generateSuggestions();
    }
  }, [title, generateSuggestions]);

  // Analyze content quality when content changes
  useEffect(() => {
    if (title && content && content.length > 10) {
      analyzeContent();
      generateTags();
    }
  }, [title, content, analyzeContent, generateTags]);

  if (!aiService.isEnabled) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-gray-600 text-sm">
          AI assistance is currently disabled. Enable it in your environment settings to get smart content suggestions.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg shadow-sm">
      <div className="border-b">
        <div className="flex space-x-4 p-4">
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`px-3 py-1 rounded text-sm font-medium ${
              activeTab === 'suggestions'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            💡 Suggestions
          </button>
          <button
            onClick={() => setActiveTab('quality')}
            className={`px-3 py-1 rounded text-sm font-medium ${
              activeTab === 'quality'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            📊 Quality
          </button>
          <button
            onClick={() => setActiveTab('titles')}
            className={`px-3 py-1 rounded text-sm font-medium ${
              activeTab === 'titles'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            📝 Titles
          </button>
        </div>
      </div>

      <div className="p-4">
        {loading && (
          <div className="flex items-center space-x-2 text-blue-600 mb-4">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm">AI is thinking...</span>
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Content Suggestions</h4>
            {suggestions.length > 0 ? (
              <ul className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span className="text-sm text-gray-700">{suggestion}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">
                Start typing a title to get AI-powered content suggestions!
              </p>
            )}

            {tags.length > 0 && (
              <div className="mt-4">
                <h5 className="font-medium text-gray-900 mb-2">Suggested Tags</h5>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'quality' && qualityAnalysis && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Content Quality Analysis</h4>
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium">Quality Score:</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      qualityAnalysis.score >= 80
                        ? 'bg-green-500'
                        : qualityAnalysis.score >= 60
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${qualityAnalysis.score}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{qualityAnalysis.score}%</span>
              </div>
            </div>
            {qualityAnalysis.feedback.length > 0 && (
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Feedback</h5>
                <ul className="space-y-1">
                  {qualityAnalysis.feedback.map((feedback, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-yellow-500 mt-1">⚠</span>
                      <span className="text-sm text-gray-700">{feedback}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'titles' && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Title Suggestions</h4>
            <button
              onClick={generateTitleSuggestions}
              disabled={!content || loading}
              className="mb-3 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              Generate Title Ideas
            </button>
            {titleSuggestions.length > 0 ? (
              <ul className="space-y-2">
                {titleSuggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{suggestion}</span>
                    <button
                      onClick={() => onTitleSuggestion && onTitleSuggestion(suggestion)}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                    >
                      Use
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">
                Write some content first, then generate title suggestions!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIContentAssistant;
