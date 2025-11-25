import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, BookOpen } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function CoursesCatalog() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: courses, isLoading } = useQuery({
    queryKey: ['/api/courses'],
  });

  const enrollMutation = useMutation({
    mutationFn: async (courseId: number) => {
      const response = await apiRequest('POST', '/api/user/courses', { courseId });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Başarılı',
        description: 'Kursa başarıyla kaydoldunuz',
      });
      // Refetch user courses after enrollment
      window.location.reload();
    },
    onError: (error: any) => {
      const errorMessage = error instanceof Error ? error.message : 'Kursa kaydolma başarısız oldu';
      toast({
        title: 'Hata',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  const filtered = courses?.filter((course: any) => {
    const matchSearch = course.title?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !category || course.category === category;
    return matchSearch && matchCategory;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Kurs Kataloğu
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            İlgi alanlarınıza uygun kursları keşfedin ve öğrenmeye başlayın
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4 flex-wrap">
            <Input
              placeholder="Kurs ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-64"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
            >
              <option value="">Tüm Kategoriler</option>
              <option value="tyt">TYT</option>
              <option value="ayt">AYT</option>
              <option value="other">Diğer</option>
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course: any) => (
              <Card
                key={course.id}
                className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                onClick={() => setLocation(`/courses/${course.id}`)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <BookOpen className="w-8 h-8 text-blue-500" />
                    <Badge>{course.level || 'Başlangıç'}</Badge>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="flex justify-between items-center text-sm text-slate-500 mb-4">
                    <span>📚 {course.modules?.length || 0} Modül</span>
                    <span>⏱️ {course.duration || 0}h</span>
                  </div>

                  {course.price ? (
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-green-600">
                        ₺{course.price}
                      </span>
                      <Button 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocation(`/checkout/${course.id}`);
                        }}
                        data-testid={`buy-${course.id}`}
                      >
                        Kaydol
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      className="w-full" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        enrollMutation.mutate(course.id);
                      }}
                      disabled={enrollMutation.isPending}
                      data-testid={`enroll-${course.id}`}
                    >
                      {enrollMutation.isPending ? 'Kaydediliyor...' : 'Başla'}
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">
              {search ? 'Uygun kurs bulunamadı' : 'Kurs yükleniyor...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
