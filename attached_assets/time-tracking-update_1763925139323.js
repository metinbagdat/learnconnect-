// functions/time-tracking-update.js

exports.updateProgressFromTimeTracking = functions.firestore
  .document('time_entries/{studentId}/entries/{entryId}')
  .onCreate(async (snapshot, context) => {
    const studentId = context.params.studentId;
    const timeEntry = snapshot.data();
    
    // Update the student's progress for the subject and topic
    const subject = timeEntry.subject;
    const topic = timeEntry.topic;
    
    // We can update the total time spent on the topic and subject
    const progressRef = admin.firestore().collection('student_progress').doc(studentId);
    
    await progressRef.update({
      [`tyt_progress.topic_progress.${subject}-${topic}.totalTime`]: admin.firestore.FieldValue.increment(timeEntry.duration),
      [`tyt_progress.topic_progress.${subject}-${topic}.lastStudied`]: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Also update the weekly goals progress
    const weeklyGoalRef = admin.firestore().collection('weekly_goals').doc(studentId)
      .collection('goals').doc(getCurrentWeekStart());
    
    await weeklyGoalRef.set({
      goals: admin.firestore.FieldValue.arrayUnion({
        subject: subject,
        topic: topic,
        hours: timeEntry.duration / 60
      })
    }, { merge: true });
    
    return null;
  });