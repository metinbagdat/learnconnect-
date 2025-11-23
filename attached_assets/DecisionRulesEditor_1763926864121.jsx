// src/admin/DecisionRulesEditor.jsx
import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const DecisionRulesEditor = () => {
  const { user } = useAuth();
  const [rules, setRules] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const rulesRef = doc(db, 'AIEngine/DecisionRules', 'tyt_planning_v1');
    const unsubscribe = onSnapshot(rulesRef, (doc) => {
      if (doc.exists()) {
        setRules(doc.data());
      }
    });

    return unsubscribe;
  }, []);

  const updateRule = async (path, value) => {
    setSaving(true);
    try {
      const rulesRef = doc(db, 'AIEngine/DecisionRules', 'tyt_planning_v1');
      await updateDoc(rulesRef, {
        [`rules.${path}`]: value,
        last_updated: new Date()
      });
    } catch (error) {
      console.error('Error updating rule:', error);
    }
    setSaving(false);
  };

  if (!rules) {
    return <div>Kurallar yükleniyor...</div>;
  }

  return (
    <div className="rules-editor">
      <h2>AI Karar Kuralları</h2>
      
      <div className="rule-group">
        <h3>Zorluk Seviyesi Eşikleri</h3>
        
        <div className="rule-item">
          <label>Başlangıç Eşiği (%)</label>
          <input
            type="number"
            value={rules.rules.difficulty_adjustment.beginner_threshold}
            onChange={(e) => updateRule('difficulty_adjustment.beginner_threshold', parseInt(e.target.value))}
          />
        </div>

        <div className="rule-item">
          <label>Orta Seviye Eşiği (%)</label>
          <input
            type="number"
            value={rules.rules.difficulty_adjustment.intermediate_threshold}
            onChange={(e) => updateRule('difficulty_adjustment.intermediate_threshold', parseInt(e.target.value))}
          />
        </div>

        <div className="rule-item">
          <label>İleri Seviye Eşiği (%)</label>
          <input
            type="number"
            value={rules.rules.difficulty_adjustment.advanced_threshold}
            onChange={(e) => updateRule('difficulty_adjustment.advanced_threshold', parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="rule-group">
        <h3>Konu Seçim Ağırlıkları</h3>
        
        <div className="rule-item">
          <label>Matematik Ağırlığı</label>
          <input
            type="number"
            step="0.1"
            value={rules.weights.mathematics}
            onChange={(e) => updateRule('weights.mathematics', parseFloat(e.target.value))}
          />
        </div>

        <div className="rule-item">
          <label>Türkçe Ağırlığı</label>
          <input
            type="number"
            step="0.1"
            value={rules.weights.turkish}
            onChange={(e) => updateRule('weights.turkish', parseFloat(e.target.value))}
          />
        </div>
      </div>

      {saving && <div>Kaydediliyor...</div>}
    </div>
  );
};

export default DecisionRulesEditor;