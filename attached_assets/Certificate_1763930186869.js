export const CertificateSchema = {
  certificateId: '', // Auto-generated
  userId: '', // Reference to user
  courseId: '', // Reference to course
  userName: '',
  courseTitle: '',
  issueDate: null, // Firestore timestamp
  expirationDate: null, // Optional: Firestore timestamp
  certificateUrl: '', // Storage URL for PDF
  verificationCode: '', // Unique code for verification
  status: 'active', // active, expired, revoked
  achievements: [], // Array of achievements
  grade: 0, // Final grade percentage
  instructorSignature: '', // Digital signature or name
  metadata: {
    generatedAt: null,
    template: 'default', // Certificate template
    language: 'en'
  }
};

// Certificate generation service
export class CertificateService {
  static async generateCertificate(userId, courseId) {
    // Check if user is eligible
    const isEligible = await this.checkEligibility(userId, courseId);
    
    if (!isEligible) {
      throw new Error('User not eligible for certificate');
    }

    const certificateData = {
      ...CertificateSchema,
      certificateId: this.generateId(),
      userId,
      courseId,
      issueDate: new Date(),
      verificationCode: this.generateVerificationCode(),
      status: 'active'
    };

    // Save to Firestore
    await firestore.collection('certificates').doc(certificateData.certificateId).set(certificateData);
    
    // Generate PDF
    const pdfUrl = await this.generatePDF(certificateData);
    
    // Update with PDF URL
    await firestore.collection('certificates').doc(certificateData.certificateId).update({
      certificateUrl: pdfUrl
    });

    return certificateData;
  }

  static generateVerificationCode() {
    return `CERT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  static generateId() {
    return `cert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}