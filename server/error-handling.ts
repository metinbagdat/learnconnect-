export class EnhancedErrorHandling {
  static async withRetry(operation: () => Promise<any>, maxRetries: number = 3, delay: number = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        if (attempt === maxRetries) throw error;
        
        console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms:`, error.message);
        await this.delay(delay * attempt);
      }
    }
  }

  static async handleOpenAIError(error: any, context: string) {
    console.error(`OpenAI Error in ${context}:`, error);
    
    if (error.code === 'rate_limit_exceeded') {
      throw new Error('AI service is currently busy. Please try again in a few moments.');
    } else if (error.code === 'insufficient_quota') {
      throw new Error('AI service quota exceeded. Please contact support.');
    } else {
      throw new Error('AI service is temporarily unavailable. Please try again later.');
    }
  }

  static validateTaskPerformance(data: any): boolean {
    const errors: string[] = [];
    
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

  static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export class EnhancedSecurity {
  static validateStudentData(studentData: any): boolean {
    const requiredFields = ['username', 'displayName'];
    const missingFields = requiredFields.filter(field => !studentData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    return true;
  }

  static sanitizeInput(input: string): string {
    if (typeof input === 'string') {
      return input.replace(/[<>]/g, '');
    }
    return input;
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
