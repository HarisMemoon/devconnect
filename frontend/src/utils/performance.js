// src/utils/performance.js

// Debounce function for performance optimization
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// Throttle function for performance optimization
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Lazy loading utility for images
export const lazyLoadImage = (src, placeholder = '/placeholder.jpg') => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => resolve(placeholder);
    img.src = src;
  });
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  };

  return new IntersectionObserver(callback, { ...defaultOptions, ...options });
};

// Local storage with expiration
export const localStorageWithExpiry = {
  set: (key, value, ttl = 3600000) => { // Default 1 hour
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  },

  get: (key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    try {
      const item = JSON.parse(itemStr);
      const now = new Date();

      if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }

      return item.value;
    } catch {
      localStorage.removeItem(key);
      return null;
    }
  },

  remove: (key) => {
    localStorage.removeItem(key);
  }
};

// Memory usage monitoring
export const memoryMonitor = {
  getUsage: () => {
    if (performance.memory) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) // MB
      };
    }
    return null;
  },

  logUsage: (label = 'Memory Usage') => {
    const usage = memoryMonitor.getUsage();
    if (usage) {
      console.log(`${label}:`, usage);
    }
  }
};

// Performance timing utilities
export const performanceTimer = {
  start: (name) => {
    performance.mark(`${name}-start`);
  },

  end: (name) => {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name)[0];
    console.log(`${name} took ${measure.duration.toFixed(2)}ms`);
    
    // Clean up
    performance.clearMarks(`${name}-start`);
    performance.clearMarks(`${name}-end`);
    performance.clearMeasures(name);
    
    return measure.duration;
  }
};

// Bundle size analyzer (development only)
export const bundleAnalyzer = {
  logComponentSize: (componentName, component) => {
    if (import.meta.env.DEV) {
      const size = JSON.stringify(component).length;
      console.log(`Component ${componentName} size: ${size} bytes`);
    }
  }
};

// Virtual scrolling helper
export const virtualScrolling = {
  calculateVisibleItems: (containerHeight, itemHeight, scrollTop, totalItems, buffer = 5) => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
    const endIndex = Math.min(
      totalItems - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + buffer
    );
    
    return { startIndex, endIndex };
  },

  getItemStyle: (index, itemHeight) => ({
    position: 'absolute',
    top: index * itemHeight,
    left: 0,
    right: 0,
    height: itemHeight
  })
};

// Image optimization
export const imageOptimization = {
  getOptimizedImageUrl: (originalUrl) => {
    // This would typically integrate with a CDN or image optimization service
    // For now, return the original URL
    return originalUrl;
  },

  preloadImages: (urls) => {
    return Promise.all(
      urls.map(url => lazyLoadImage(url))
    );
  }
};

// Code splitting helper
export const createDynamicImport = (importFunction) => {
  return () =>
    importFunction().catch(err => {
      console.error('Dynamic import failed:', err);
      // Return a fallback component
      return { default: () => 'Failed to load component' };
    });
};

// Service Worker registration
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};
