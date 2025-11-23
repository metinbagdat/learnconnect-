// src/components/Certificate/CertificateComponent.jsx
import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, addDoc, collection, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { PictureAsPdf, Share } from '@mui/icons-material';

const CertificateComponent = ({ courseId }) => {
  const [certificate, setCertificate] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    if (!courseId) return;

    const certificatesQuery = query(
      collection(db, 'certificates'),
      where('userId', '==', 'currentUserId'),
      where('courseId', '==', courseId)
    );

    const unsubscribe = onSnapshot(certificatesQuery, (snapshot) => {
      if (!snapshot.empty) {
        setCertificate(snapshot.docs[0].data());
      }
    });

    return unsubscribe;
  }, [courseId]);

  const generateCertificate = async () => {
    // In a real app, we would generate a PDF certificate on the server
    // For now, we'll create a certificate record with a dummy URL
    const certificateData = {
      userId: 'currentUserId',
      courseId,
      certificateUrl: `https://example.com/certificates/${courseId}-${Date.now()}.pdf`,
      issuedAt: new Date(),
      verificationCode: Math.random().toString(36).substring(2, 10).toUpperCase()
    };

    try {
      await addDoc(collection(db, 'certificates'), certificateData);
    } catch (error) {
      console.error('Error generating certificate:', error);
    }
  };

  if (!certificate) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Course Completed! 🎉
          </Typography>
          <Typography variant="body2" gutterBottom>
            You have successfully completed this course. Generate your certificate to showcase your achievement.
          </Typography>
          <Button variant="contained" onClick={generateCertificate}>
            Generate Certificate
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Certificate of Completion
          </Typography>
          <Typography variant="body2" gutterBottom>
            Your certificate is ready. You can view, download, or share it.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="outlined" 
              startIcon={<PictureAsPdf />}
              onClick={() => setShowCertificate(true)}
            >
              View Certificate
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<Share />}
            >
              Share
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={showCertificate} onClose={() => setShowCertificate(false)} maxWidth="md" fullWidth>
        <DialogTitle>Your Certificate</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h4" gutterBottom>
              Certificate of Completion
            </Typography>
            <Typography variant="h6" gutterBottom>
              This certifies that
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ textDecoration: 'underline' }}>
              John Doe
            </Typography>
            <Typography variant="body1" gutterBottom>
              has successfully completed the course
            </Typography>
            <Typography variant="h6" gutterBottom>
              {courseId} {/* We would fetch the course title */}
            </Typography>
            <Typography variant="body2" gutterBottom>
              on {certificate.issuedAt.toDate().toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Verification Code: {certificate.verificationCode}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCertificate(false)}>Close</Button>
          <Button variant="contained" onClick={() => window.open(certificate.certificateUrl, '_blank')}>
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CertificateComponent;