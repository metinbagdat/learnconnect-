// Updated: enhanced-error-handling.js
export class EnhancedErrorHandling {
  static async withRetry(operation, maxRetries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === maxRetries) throw error;
        
        console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms:`, error.message);
        await this.delay(delay * attempt); // Exponential backoff
      }
    }
  }

  static async handleOpenAIError(error, context) {
    console.error(`OpenAI Error in ${context}:`, error);
    
    if (error.code === 'rate_limit_exceeded') {
      throw new Error('AI service is currently busy. Please try again in a few moments.');
    } else if (error.code === 'insufficient_quota') {
      throw new Error('AI service quota exceeded. Please contact support.');
    } else if (error.code === 'invalid_request_error') {
      throw new Error('Invalid request to AI service. Please check your input.');
    } else {
      throw new Error('AI service is temporarily unavailable. Please try again later.');
    }
  }

  static async handleFirestoreError(error, context) {
    console.error(`Firestore Error in ${context}:`, error);
    
    if (error.code === 'failed-precondition') {
      throw new Error('Database operation failed. Please try again.');
    } else if (error.code === 'permission-denied') {
      throw new Error('You do not have permission to perform this action.');
    } else if (error.code === 'resource-exhausted') {
      throw new Error('Database quota exceeded. Please try again later.');
    } else {
      throw new Error('Database service is temporarily unavailable.');
    }
  }

  static validateTaskPerformance(data) {
    const errors = [];
    
    if (!data.taskId || typeof data.taskId !== 'string') {
      errors.push('Invalid task ID');
    }
    
    if (!data.performanceData || typeof data.performanceData !== 'object') {
      errors.push('Invalid performance data');
    }
    
    if (data.performanceData?.timeSpent && data.performanceData.timeSpent > 480) {
      errors.push('Time spent exceeds maximum allowed (480 minutes)');
    }
    
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
    
    return true;
  }

  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}