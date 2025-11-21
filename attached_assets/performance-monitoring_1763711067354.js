// Updated: performance-monitoring.js
export class PerformanceMonitor {
  static metrics = {
    pageLoadTimes: [],
    apiResponseTimes: [],
    renderTimes: [],
    errors: []
  };

  static startPageLoad() {
    this.pageLoadStart = performance.now();
  }

  static endPageLoad() {
    const loadTime = performance.now() - this.pageLoadStart;
    this.metrics.pageLoadTimes.push(loadTime);
    
    if (loadTime > 3000) { // 3 seconds threshold
      this.logPerformanceIssue('slow_page_load', { loadTime });
    }
    
    return loadTime;
  }

  static startApiCall(endpoint) {
    const startTime = performance.now();
    return {
      endpoint,
      startTime,
      complete: () => {
        const duration = performance.now() - startTime;
        this.metrics.apiResponseTimes.push({ endpoint, duration });
        
        if (duration > 5000) { // 5 seconds threshold
          this.logPerformanceIssue('slow_api_response', { endpoint, duration });
        }
        
        return duration;
      }
    };
  }

  static startComponentRender(componentName) {
    const startTime = performance.now();
    return () => {
      const duration = performance.now() - startTime;
      this.metrics.renderTimes.push({ componentName, duration });
      
      if (duration > 100) { // 100ms threshold
        this.logPerformanceIssue('slow_component_render', { componentName, duration });
      }
      
      return duration;
    };
  }

  static logError(error, context) {
    const errorRecord = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    };
    
    this.metrics.errors.push(errorRecord);
    
    // Send to error tracking service
    this.sendToAnalytics('error', errorRecord);
  }

  static getPerformanceReport() {
    const average = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
    
    return {
      pageLoad: {
        average: average(this.metrics.pageLoadTimes),
        max: Math.max(...this.metrics.pageLoadTimes),
        count: this.metrics.pageLoadTimes.length
      },
      apiCalls: this.metrics.apiResponseTimes.reduce((acc, curr) => {
        if (!acc[curr.endpoint]) acc[curr.endpoint] = [];
        acc[curr.endpoint].push(curr.duration);
        return acc;
      }, {}),
      componentRenders: this.metrics.renderTimes.reduce((acc, curr) => {
        if (!acc[curr.componentName]) acc[curr.componentName] = [];
        acc[curr.componentName].push(curr.duration);
        return acc;
      }, {}),
      errors: this.metrics.errors.length
    };
  }

  static async sendPeriodicReport() {
    const report = this.getPerformanceReport();
    await this.sendToAnalytics('performance_report', report);
    
    // Clear metrics after reporting
    this.metrics = {
      pageLoadTimes: [],
      apiResponseTimes: [],
      renderTimes: [],
      errors: []
    };
  }

  static logPerformanceIssue(type, data) {
    console.warn(`Performance Issue: ${type}`, data);
    this.sendToAnalytics('performance_issue', { type, ...data });
  }

  static async sendToAnalytics(type, data) {
    try {
      // Replace with your analytics service
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data, timestamp: Date.now() })
      });
    } catch (error) {
      console.error('Failed to send analytics:', error);
    }
  }
}

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    PerformanceMonitor.endPageLoad();
    
    // Send periodic reports every 5 minutes
    setInterval(() => {
      PerformanceMonitor.sendPeriodicReport();
    }, 5 * 60 * 1000);
  });
}