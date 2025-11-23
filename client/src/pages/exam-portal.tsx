import React, { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';

export default function ExamPortal() {
  const [match, params] = useRoute('/exams/:id');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);

  const { data: exam, isLoading } = useQuery({
    queryKey: [`/api/exams/${params?.id}`],
    enabled: !!params?.id,
  });

  const submitExamMutation = useMutation({
    mutationFn: (data) =>
      apiRequest('POST', `/api/exams/${params?.id}/submit`, data),
    onSuccess: () => {
      setExamCompleted(true);
      queryClient.invalidateQueries({ queryKey: [`/api/exams/${params?.id}`] });
    },
  });

  useEffect(() => {
    if (!examStarted || timeLeft <= 0 || !exam) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          submitExamMutation.mutate({ answers, timeSpent: exam.duration * 60 });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, examStarted, exam, answers, submitExamMutation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!exam) {
    return <div className="text-center py-12">Sınav bulunamadı</div>;
  }

  const questions = exam.questions || [];
  const currentQ = questions[currentQuestion];

  if (!examStarted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="p-12 max-w-md">
          <h1 className="text-2xl font-bold mb-4">{exam.title}</h1>
          <div className="space-y-2 mb-6 text-slate-600">
            <p>⏱️ Süre: {exam.duration} dakika</p>
            <p>📝 Soru Sayısı: {questions.length}</p>
            <p>✅ Geçme Notu: %{(exam.passingScore * 100).toFixed(0)}</p>
          </div>
          <Button
            className="w-full"
            onClick={() => {
              setExamStarted(true);
              setTimeLeft(exam.duration * 60);
              setAnswers({});
            }}
          >
            Sınavı Başlat
          </Button>
        </Card>
      </div>
    );
  }

  if (examCompleted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <Card className="p-12 max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4">✅ Sınav Tamamlandı!</h1>
          <p className="text-slate-600 mb-6">
            Cevaplarınız kaydedildi. Sonuçlar hesaplanıyor...
          </p>
          <Button>Sonuçları Gör</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{exam.title}</h1>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigation */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h3 className="font-bold mb-4">Sorular</h3>
              <div className="grid grid-cols-5 lg:grid-cols-4 gap-2 max-h-96 overflow-y-auto">
                {questions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestion(idx)}
                    className={`p-2 rounded text-sm font-medium transition-colors ${
                      currentQuestion === idx
                        ? 'bg-blue-500 text-white'
                        : answers[idx]
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Question */}
          <div className="lg:col-span-3">
            <Card className="p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">
                  Soru {currentQuestion + 1}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  {currentQ?.question}
                </p>
              </div>

              {/* Answer Options */}
              <div className="space-y-3 mb-8">
                {currentQ?.options?.map((option: string, idx: number) => (
                  <label key={idx} className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-slate-200 dark:border-slate-700">
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      checked={answers[currentQuestion] === option}
                      onChange={() =>
                        setAnswers({
                          ...answers,
                          [currentQuestion]: option,
                        })
                      }
                      className="w-4 h-4"
                    />
                    <span className="ml-3 font-medium">{option}</span>
                  </label>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentQuestion(Math.max(0, currentQuestion - 1))
                  }
                  disabled={currentQuestion === 0}
                >
                  Önceki
                </Button>

                {currentQuestion === questions.length - 1 ? (
                  <Button
                    onClick={() => {
                      submitExamMutation.mutate({
                        answers,
                        timeSpent: exam.duration * 60 - timeLeft,
                      });
                    }}
                    disabled={submitExamMutation.isPending}
                  >
                    Sınavı Bitir
                  </Button>
                ) : (
                  <Button
                    onClick={() =>
                      setCurrentQuestion(
                        Math.min(questions.length - 1, currentQuestion + 1)
                      )
                    }
                  >
                    Sonraki
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
