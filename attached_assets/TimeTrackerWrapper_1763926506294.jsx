// components/TimeTrackerWrapper.js

import React from 'react';
import { TimeTracker } from 'react-time-tracking'; // Assuming we have this
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const TimeTrackerWrapper = ({ studentId }) => {
  const handleStartTracking = async (subject, topic, task) => {
    const docRef = await addDoc(collection(db, 'time_entries', studentId, 'entries'), {
      startTime: serverTimestamp(),
      subject,
      topic,
      task,
      note: ''
    });
    
    return docRef.id;
  };

  const handleStopTracking = async (entryId, note) => {
    await updateDoc(doc(db, 'time_entries', studentId, 'entries', entryId), {
      endTime: serverTimestamp(),
      note,
      duration: calculateDuration(startTime, new Date()) // You need to calculate the duration
    });
  };

  return (
    <TimeTracker
      onStart={handleStartTracking}
      onStop={handleStopTracking}
    />
  );
};

export default TimeTrackerWrapper;