// src/services/aiService.js

const AI_ENABLED = import.meta.env.VITE_AI_ENABLED === 'true';

// Mock AI service for demonstration - replace with actual AI API calls
class AIService {
  constructor() {
    this.isEnabled = AI_ENABLED;
  }

  // Generate content suggestions based on title
  async generateContentSuggestions(title) {
    if (!this.isEnabled) return [];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock suggestions based on title keywords
    const suggestions = this.getMockSuggestions(title);
    return suggestions;
  }

  // Generate title suggestions based on content
  async generateTitleSuggestions(content) {
    if (!this.isEnabled) return [];

    await new Promise(resolve => setTimeout(resolve, 800));

    const words = content.split(' ').slice(0, 10);
    const suggestions = [
      `How to ${words.slice(0, 3).join(' ')}`,
      `Understanding ${words.slice(1, 4).join(' ')}`,
      `A Guide to ${words.slice(0, 4).join(' ')}`,
      `${words.slice(0, 2).join(' ')}: Best Practices`,
      `Mastering ${words.slice(0, 3).join(' ')}`
    ].filter(s => s.length > 10 && s.length < 60);

    return suggestions.slice(0, 3);
  }

  // Improve content with AI suggestions
  async improveContent(content) {
    if (!this.isEnabled) return content;

    await new Promise(resolve => setTimeout(resolve, 1200));

    // Mock content improvement
    const improvements = [
      'Consider adding specific examples to illustrate your points.',
      'You might want to include code snippets for better clarity.',
      'Adding a conclusion section would strengthen your post.',
      'Consider breaking long paragraphs into smaller ones for readability.'
    ];

    return {
      improvedContent: content,
      suggestions: improvements.slice(0, 2)
    };
  }

  // Generate tags based on content
  async generateTags(title, content) {
    if (!this.isEnabled) return [];

    await new Promise(resolve => setTimeout(resolve, 600));

    const text = `${title} ${content}`.toLowerCase();
    const techKeywords = [
      'javascript', 'react', 'node', 'python', 'java', 'css', 'html',
      'api', 'database', 'frontend', 'backend', 'web', 'mobile',
      'tutorial', 'guide', 'tips', 'best practices', 'performance'
    ];

    const foundTags = techKeywords.filter(keyword => 
      text.includes(keyword)
    ).slice(0, 5);

    return foundTags;
  }

  // Check content quality and provide feedback
  async analyzeContentQuality(title, content) {
    if (!this.isEnabled) return { score: 100, feedback: [] };

    await new Promise(resolve => setTimeout(resolve, 900));

    const feedback = [];
    let score = 100;

    if (title.length < 10) {
      feedback.push('Title is too short. Consider making it more descriptive.');
      score -= 15;
    }

    if (content.length < 100) {
      feedback.push('Content is quite short. Consider adding more details.');
      score -= 20;
    }

    if (!content.includes('.') || content.split('.').length < 3) {
      feedback.push('Consider breaking your content into more sentences.');
      score -= 10;
    }

    if (title.length > 100) {
      feedback.push('Title might be too long. Consider shortening it.');
      score -= 10;
    }

    return {
      score: Math.max(score, 0),
      feedback
    };
  }

  // Moderate comment content
  async moderateComment(text) {
    if (!this.isEnabled) return { approved: true, reason: null };

    await new Promise(resolve => setTimeout(resolve, 500));

    const textLower = text.toLowerCase();

    // Check for spam patterns
    const spamPatterns = [
      /(.)\1{4,}/, // Repeated characters
      /https?:\/\/[^\s]+/g, // URLs
      /\b(buy|sale|discount|offer|deal|free|win|prize)\b/gi,
      /\b(click here|visit now|limited time)\b/gi
    ];

    // Check for inappropriate content
    const inappropriateWords = [
      'spam', 'scam', 'fake', 'stupid', 'idiot', 'hate'
    ];

    // Check for spam patterns
    for (const pattern of spamPatterns) {
      if (pattern.test(text)) {
        return {
          approved: false,
          reason: 'Comment appears to be spam',
          confidence: 0.8
        };
      }
    }

    // Check for inappropriate words
    const foundInappropriate = inappropriateWords.some(word =>
      textLower.includes(word)
    );

    if (foundInappropriate) {
      return {
        approved: false,
        reason: 'Comment contains inappropriate language',
        confidence: 0.7
      };
    }

    // Check comment length and quality
    if (text.length < 3) {
      return {
        approved: false,
        reason: 'Comment is too short',
        confidence: 0.9
      };
    }

    if (text.length > 1000) {
      return {
        approved: false,
        reason: 'Comment is too long',
        confidence: 0.6
      };
    }

    return { approved: true, reason: null, confidence: 1.0 };
  }

  // Suggest comment improvements
  async suggestCommentImprovement(text) {
    if (!this.isEnabled) return [];

    await new Promise(resolve => setTimeout(resolve, 400));

    const suggestions = [];

    if (text.length < 10) {
      suggestions.push('Consider adding more detail to your comment');
    }

    if (!text.includes('?') && !text.includes('.')) {
      suggestions.push('Consider adding punctuation for better readability');
    }

    if (text === text.toUpperCase() && text.length > 5) {
      suggestions.push('Consider using normal capitalization instead of ALL CAPS');
    }

    return suggestions;
  }

  getMockSuggestions(title) {
    const titleLower = title.toLowerCase();

    if (titleLower.includes('react')) {
      return [
        'Start by explaining what React is and why it\'s popular',
        'Include code examples with proper syntax highlighting',
        'Discuss React hooks and their benefits',
        'Mention best practices for component structure'
      ];
    }

    if (titleLower.includes('javascript')) {
      return [
        'Begin with the fundamentals of JavaScript',
        'Include practical examples and use cases',
        'Discuss ES6+ features and modern syntax',
        'Explain common pitfalls and how to avoid them'
      ];
    }

    if (titleLower.includes('tutorial') || titleLower.includes('guide')) {
      return [
        'Start with prerequisites and setup instructions',
        'Break down complex concepts into simple steps',
        'Include screenshots or diagrams where helpful',
        'End with a summary and next steps'
      ];
    }

    // Generic suggestions
    return [
      'Start with an engaging introduction that hooks the reader',
      'Use clear headings to structure your content',
      'Include practical examples to illustrate your points',
      'End with a conclusion that summarizes key takeaways'
    ];
  }
}

export default new AIService();
