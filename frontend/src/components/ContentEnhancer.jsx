// src/components/ContentEnhancer.jsx
import React, { useState } from 'react';
import aiService from '../services/aiService';

const ContentEnhancer = ({ content, onContentUpdate }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState('');
  const [readingTime, setReadingTime] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [improvements, setImprovements] = useState([]);

  // Calculate reading time and word count
  React.useEffect(() => {
    if (content) {
      const words = content.trim().split(/\s+/).length;
      setWordCount(words);
      setReadingTime(Math.ceil(words / 200)); // Average reading speed: 200 words per minute
    } else {
      setWordCount(0);
      setReadingTime(0);
    }
  }, [content]);

  const generateSummary = async () => {
    if (!content || !aiService.isEnabled) return;

    setIsProcessing(true);
    try {
      // Mock summary generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const sentences = content.split('.').filter(s => s.trim().length > 0);
      const keyPoints = sentences.slice(0, 2).map(s => s.trim() + '.');
      const generatedSummary = keyPoints.join(' ');
      
      setSummary(generatedSummary || 'This content discusses key concepts and provides valuable insights.');
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const improveContent = async () => {
    if (!content || !aiService.isEnabled) return;

    setIsProcessing(true);
    try {
      const result = await aiService.improveContent(content);
      setImprovements(result.suggestions || []);
      
      if (result.improvedContent && result.improvedContent !== content) {
        onContentUpdate && onContentUpdate(result.improvedContent);
      }
    } catch (error) {
      console.error('Error improving content:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatContent = () => {
    if (!content) return;

    // Basic formatting improvements
    let formatted = content
      .replace(/\n\n+/g, '\n\n') // Remove extra line breaks
      .replace(/([.!?])\s*([A-Z])/g, '$1 $2') // Ensure proper spacing after sentences
      .trim();

    onContentUpdate && onContentUpdate(formatted);
  };

  const addStructure = () => {
    if (!content) return;

    const paragraphs = content.split('\n\n').filter(p => p.trim());
    if (paragraphs.length <= 1) return;

    let structured = '';
    
    // Add introduction if not present
    if (!content.toLowerCase().includes('introduction') && !content.toLowerCase().includes('overview')) {
      structured += '## Introduction\n\n';
    }
    
    structured += paragraphs[0] + '\n\n';
    
    // Add main content sections
    if (paragraphs.length > 2) {
      structured += '## Main Content\n\n';
      for (let i = 1; i < paragraphs.length - 1; i++) {
        structured += paragraphs[i] + '\n\n';
      }
    }
    
    // Add conclusion if content is long enough
    if (paragraphs.length > 1) {
      structured += '## Conclusion\n\n';
      structured += paragraphs[paragraphs.length - 1];
    }

    onContentUpdate && onContentUpdate(structured);
  };

  const getReadabilityScore = () => {
    if (!content) return 0;
    
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = content.trim().split(/\s+/);
    const avgWordsPerSentence = words.length / sentences.length;
    
    // Simple readability score (lower is better)
    if (avgWordsPerSentence <= 15) return 90;
    if (avgWordsPerSentence <= 20) return 75;
    if (avgWordsPerSentence <= 25) return 60;
    return 45;
  };

  if (!aiService.isEnabled && !content) {
    return null;
  }

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Content Enhancement</h3>
      
      {/* Content Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{wordCount}</div>
          <div className="text-sm text-gray-600">Words</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{readingTime}</div>
          <div className="text-sm text-gray-600">Min Read</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{getReadabilityScore()}</div>
          <div className="text-sm text-gray-600">Readability</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {content ? content.split('\n\n').length : 0}
          </div>
          <div className="text-sm text-gray-600">Paragraphs</div>
        </div>
      </div>

      {/* Enhancement Actions */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={formatContent}
            disabled={!content}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 text-sm"
          >
            📝 Format Text
          </button>
          <button
            onClick={addStructure}
            disabled={!content || content.split('\n\n').length <= 1}
            className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50 text-sm"
          >
            🏗️ Add Structure
          </button>
          {aiService.isEnabled && (
            <>
              <button
                onClick={generateSummary}
                disabled={!content || isProcessing}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 disabled:opacity-50 text-sm"
              >
                📄 Generate Summary
              </button>
              <button
                onClick={improveContent}
                disabled={!content || isProcessing}
                className="px-3 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 disabled:opacity-50 text-sm"
              >
                ✨ AI Improve
              </button>
            </>
          )}
        </div>

        {isProcessing && (
          <div className="flex items-center space-x-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm">Processing...</span>
          </div>
        )}
      </div>

      {/* Summary */}
      {summary && (
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <h4 className="font-medium text-purple-900 mb-2">Generated Summary</h4>
          <p className="text-purple-800 text-sm">{summary}</p>
        </div>
      )}

      {/* Improvements */}
      {improvements.length > 0 && (
        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <h4 className="font-medium text-orange-900 mb-2">Improvement Suggestions</h4>
          <ul className="space-y-1">
            {improvements.map((improvement, index) => (
              <li key={index} className="text-orange-800 text-sm flex items-start space-x-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Readability Tips */}
      {content && getReadabilityScore() < 70 && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2">Readability Tips</h4>
          <ul className="space-y-1 text-yellow-800 text-sm">
            <li>• Try to keep sentences under 20 words</li>
            <li>• Break long paragraphs into shorter ones</li>
            <li>• Use simple, clear language</li>
            <li>• Add headings to organize content</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ContentEnhancer;
