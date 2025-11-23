// Updated: enhanced-security.js
export class EnhancedSecurity {
  static validateStudentData(studentData) {
    const requiredFields = ['personalInfo', 'examPreferences', 'studySettings'];
    const missingFields = requiredFields.filter(field => !studentData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Validate email format
    if (studentData.personalInfo.email && !this.isValidEmail(studentData.personalInfo.email)) {
      throw new Error('Invalid email format');
    }

    // Validate study hours are reasonable
    if (studentData.studySettings.dailyStudyHours > 16) {
      throw new Error('Daily study hours cannot exceed 16 hours');
    }

    return true;
  }

  static sanitizeInput(input) {
    if (typeof input === 'string') {
      // Remove potentially dangerous characters
      return input.replace(/[<>]/g, '');
    }
    return input;
  }

  static async rateLimitCheck(studentId, action) {
    const rateLimits = {
      generatePlan: { max: 5, window: 3600000 }, // 5 per hour
      submitTest: { max: 10, window: 3600000 }, // 10 per hour
      updateProgress: { max: 100, window: 3600000 } // 100 per hour
    };

    const limit = rateLimits[action];
    if (!limit) return true;

    const key = `rate_limit:${studentId}:${action}`;
    const current = await this.getCurrentCount(key);
    
    if (current >= limit.max) {
      throw new Error(`Rate limit exceeded for ${action}. Please try again later.`);
    }

    await this.incrementCount(key, limit.window);
    return true;
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}