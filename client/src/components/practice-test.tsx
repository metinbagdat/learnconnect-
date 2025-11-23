import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function PracticeTest() {
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [testType, setTestType] = useState('tyt');

  const questions = [
    {
      id: 1,
      question: 'Sample question 1?',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correct: 'Option A',
    },
  ];

  if (!testStarted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">📝 Practice Test</h2>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block mb-2 font-medium">Test Type</label>
              <select
                value={testType}
                onChange={(e) => setTestType(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="tyt">TYT</option>
                <option value="ayt">AYT</option>
              </select>
            </div>
          </div>
          <Button size="lg" onClick={() => setTestStarted(true)}>
            Start Test
          </Button>
        </Card>
      </div>
    );
  }

  const q = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">Question {currentQuestion + 1} of {questions.length}</h3>
          <Badge>{Math.round(progress)}%</Badge>
        </div>

        <Progress value={progress} className="mb-6" />

        <h4 className="text-lg font-medium mb-4">{q.question}</h4>

        <div className="space-y-3 mb-6">
          {q.options.map((option, idx) => (
            <label key={idx} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
              <input
                type="radio"
                name="answer"
                checked={answers[currentQuestion] === option}
                onChange={() => setAnswers({ ...answers, [currentQuestion]: option })}
                className="w-4 h-4"
              />
              <span className="ml-3">{option}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          {currentQuestion < questions.length - 1 ? (
            <Button onClick={() => setCurrentQuestion(currentQuestion + 1)}>
              Next
            </Button>
          ) : (
            <Button onClick={() => alert('Test completed!')}>
              Submit Test
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
