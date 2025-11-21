// firestore.indexes.json (Updated)
{
  "indexes": [
    {
      "collectionGroup": "DailyPlans",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "student_id", "order": "ASCENDING" },
        { "fieldPath": "date", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "PerformanceLogs", 
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "student_id", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "Subjects",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "weight", "order": "DESCENDING" },
        { "fieldPath": "difficulty", "order": "ASCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}