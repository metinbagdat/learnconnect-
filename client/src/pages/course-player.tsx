import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRoute, useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, ChevronRight, ChevronLeft } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';

export default function CoursePlayer() {
  const [match, params] = useRoute('/courses/:id');
  const [, setLocation] = useLocation();
  const [selectedModule, setSelectedModule] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState(0);

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: [`/api/courses/${params?.id}`],
    enabled: !!params?.id,
  });

  const { data: enrollment, isLoading: enrollmentLoading } = useQuery({
    queryKey: [`/api/enrollments/${params?.id}`],
    enabled: !!params?.id,
  });

  const completeLessonMutation = useMutation({
    mutationFn: (lessonId: string) =>
      apiRequest('PATCH', `/api/enrollments/${params?.id}/progress`, { lessonId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/enrollments/${params?.id}`] });
    },
  });

  if (courseLoading || enrollmentLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return <div className="text-center py-12">Kurs bulunamadı</div>;
  }

  const modules = course.modules || [];
  const currentModule = modules[selectedModule];
  const currentLesson = currentModule?.lessons?.[selectedLesson];
  const progress = enrollment?.progress || {};

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar - Course Structure */}
      <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto">
        <div className="p-4 sticky top-0 bg-white dark:bg-slate-900 border-b dark:border-slate-800">
          <h2 className="font-bold text-lg truncate">{course.title}</h2>
          <Progress value={(progress.completionPercentage || 0) * 100} className="mt-2" />
          <p className="text-xs text-slate-500 mt-1">
            {progress.completionPercentage || 0}% tamamlandı
          </p>
        </div>

        <div className="p-4 space-y-4">
          {modules.map((module: any, mIdx: number) => (
            <div key={module.id}>
              <h3
                className={`font-semibold mb-2 cursor-pointer p-2 rounded transition-colors ${
                  selectedModule === mIdx
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                onClick={() => {
                  setSelectedModule(mIdx);
                  setSelectedLesson(0);
                }}
              >
                📚 {module.title}
              </h3>

              {selectedModule === mIdx && (
                <div className="ml-2 space-y-1">
                  {module.lessons?.map((lesson: any, lIdx: number) => (
                    <button
                      key={lesson.id}
                      onClick={() => setSelectedLesson(lIdx)}
                      className={`w-full text-left p-2 rounded text-sm transition-colors ${
                        selectedLesson === lIdx
                          ? 'bg-blue-500 text-white'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {progress.completedLessons?.includes(lesson.id) ? '✓' : '○'} {lesson.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {currentLesson ? (
          <>
            <div className="flex-1 overflow-y-auto p-8">
              <Card className="max-w-4xl mx-auto p-8">
                <h1 className="text-3xl font-bold mb-4">{currentLesson.title}</h1>

                <div className="flex gap-4 text-sm text-slate-600 dark:text-slate-400 mb-6">
                  <span>📖 {currentLesson.readingTime || 5} min okuma</span>
                  <span>📝 {currentLesson.wordCount || 500} kelime</span>
                </div>

                <div className="prose dark:prose-invert max-w-none mb-8">
                  {currentLesson.content && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: currentLesson.content
                          .split('\n')
                          .map((line: string) =>
                            line.startsWith('#')
                              ? `<h${line.match(/#/g)?.length || 1}>${line.replace(/#/g, '')}</h${line.match(/#/g)?.length || 1}>`
                              : `<p>${line}</p>`
                          )
                          .join(''),
                      }}
                    />
                  )}
                </div>

                {currentLesson.resources && currentLesson.resources.length > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                    <h3 className="font-bold mb-2">Kaynaklar</h3>
                    <ul className="space-y-1 text-sm">
                      {currentLesson.resources.map((res: string, i: number) => (
                        <li key={i}>📎 {res}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            </div>

            {/* Navigation */}
            <div className="border-t dark:border-slate-800 p-6 bg-white dark:bg-slate-900 flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => {
                  if (selectedLesson > 0) {
                    setSelectedLesson(selectedLesson - 1);
                  } else if (selectedModule > 0) {
                    setSelectedModule(selectedModule - 1);
                    setSelectedLesson((modules[selectedModule - 1]?.lessons?.length || 1) - 1);
                  }
                }}
                disabled={selectedModule === 0 && selectedLesson === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Önceki
              </Button>

              <Button
                onClick={() => {
                  completeLessonMutation.mutate(currentLesson.id);
                }}
                disabled={completeLessonMutation.isPending}
              >
                {progress.completedLessons?.includes(currentLesson.id)
                  ? '✓ Tamamlandı'
                  : 'Dersi Tamamla'}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  if (selectedLesson < (currentModule?.lessons?.length || 1) - 1) {
                    setSelectedLesson(selectedLesson + 1);
                  } else if (selectedModule < modules.length - 1) {
                    setSelectedModule(selectedModule + 1);
                    setSelectedLesson(0);
                  }
                }}
                disabled={
                  selectedModule === modules.length - 1 &&
                  selectedLesson === (currentModule?.lessons?.length || 1) - 1
                }
              >
                Sonraki <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Card className="text-center p-12">
              <h2 className="text-2xl font-bold mb-4">Kursa Hoş Geldiniz!</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Başlamak için soldaki menüden bir ders seçin
              </p>
              <Button onClick={() => setSelectedLesson(0)}>İlk Dersi Başlat</Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
