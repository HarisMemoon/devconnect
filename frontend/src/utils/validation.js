// src/utils/validation.js

export const validateBlogPost = (title, content) => {
  const errors = [];

  // Title validation
  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  } else if (title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long');
  } else if (title.trim().length > 100) {
    errors.push('Title must be less than 100 characters');
  }

  // Content validation
  if (!content || content.trim().length === 0) {
    errors.push('Content is required');
  } else if (content.trim().length < 10) {
    errors.push('Content must be at least 10 characters long');
  } else if (content.trim().length > 5000) {
    errors.push('Content must be less than 5000 characters');
  }

  // Check for potentially harmful content
  const suspiciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi
  ];

  const combinedText = `${title} ${content}`.toLowerCase();
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(combinedText)) {
      errors.push('Content contains potentially harmful code');
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateComment = (text) => {
  const errors = [];

  if (!text || text.trim().length === 0) {
    errors.push('Comment cannot be empty');
  } else if (text.trim().length < 2) {
    errors.push('Comment must be at least 2 characters long');
  } else if (text.trim().length > 1000) {
    errors.push('Comment must be less than 1000 characters');
  }

  // Check for spam patterns
  const spamPatterns = [
    /(.)\1{4,}/, // Repeated characters
    /https?:\/\/[^\s]+/g, // URLs
    /\b(buy|sale|discount|offer|deal|free|win|prize)\b/gi
  ];

  for (const pattern of spamPatterns) {
    if (pattern.test(text)) {
      errors.push('Comment appears to be spam');
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true, error: null };
};

export const validatePassword = (password) => {
  const errors = [];

  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    if (password.length > 128) {
      errors.push('Password must be less than 128 characters');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateUsername = (username) => {
  const errors = [];

  if (!username || username.trim().length === 0) {
    errors.push('Username is required');
  } else {
    if (username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }
    if (username.length > 30) {
      errors.push('Username must be less than 30 characters');
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      errors.push('Username can only contain letters, numbers, underscores, and hyphens');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Sanitize user input
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
};

// Rate limiting helper
export const createRateLimiter = (maxAttempts = 5, windowMs = 60000) => {
  const attempts = new Map();

  return (identifier) => {
    const now = Date.now();
    const userAttempts = attempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = userAttempts.filter(time => now - time < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      return {
        allowed: false,
        resetTime: Math.ceil((recentAttempts[0] + windowMs - now) / 1000)
      };
    }
    
    recentAttempts.push(now);
    attempts.set(identifier, recentAttempts);
    
    return { allowed: true, resetTime: 0 };
  };
};
