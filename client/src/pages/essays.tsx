import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Send, CheckCircle2, Clock, BookOpen } from "lucide-react";
import { useLanguage } from "@/contexts/consolidated-language-context";
import { motion, AnimatePresence } from "framer-motion";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import PageWrapper from "@/components/layout/page-wrapper";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

interface Essay {
  id: number;
  userId: number;
  courseId?: number;
  title: string;
  prompt?: string;
  content?: string;
  fileId?: number;
  status: 'draft' | 'submitted' | 'reviewed' | 'graded';
  wordCount?: number;
  submittedAt?: string;
  reviewedAt?: string;
  grade?: number;
  aiFeedback?: string;
  instructorFeedback?: string;
  createdAt: string;
  updatedAt: string;
}

export default function EssaysPage() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEssay, setSelectedEssay] = useState<Essay | null>(null);
  const [newEssay, setNewEssay] = useState({
    title: '',
    prompt: '',
    content: '',
    courseId: undefined as number | undefined
  });

  // Fetch user's essays
  const { data: essays, isLoading } = useQuery<Essay[]>({
    queryKey: ['/api/essays'],
  });

  // Create essay mutation
  const createEssayMutation = useMutation({
    mutationFn: async (essay: typeof newEssay) => {
      return apiRequest('POST', '/api/essays', essay);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/essays'] });
      setShowCreateForm(false);
      setNewEssay({ title: '', prompt: '', content: '', courseId: undefined });
      toast({
        title: language === 'tr' ? 'Deneme Oluşturuldu' : 'Essay Created',
        description: language === 'tr' ? 'Denemeniz başarıyla oluşturuldu' : 'Your essay was created successfully'
      });
    },
    onError: () => {
      toast({
        title: language === 'tr' ? 'Hata' : 'Error',
        description: language === 'tr' ? 'Deneme oluşturulurken hata oluştu' : 'Failed to create essay',
        variant: 'destructive'
      });
    }
  });

  // Submit essay mutation
  const submitEssayMutation = useMutation({
    mutationFn: async (essayId: number) => {
      return apiRequest('POST', `/api/essays/${essayId}/submit`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/essays'] });
      toast({
        title: language === 'tr' ? 'Deneme Gönderildi' : 'Essay Submitted',
        description: language === 'tr' ? 'Denemeniz değerlendirme için gönderildi' : 'Your essay has been submitted for review'
      });
    }
  });

  const handleCreateEssay = () => {
    if (!newEssay.title.trim() || !newEssay.content.trim()) {
      toast({
        title: language === 'tr' ? 'Eksik Bilgi' : 'Incomplete Information',
        description: language === 'tr' ? 'Başlık ve içerik gereklidir' : 'Title and content are required',
        variant: 'destructive'
      });
      return;
    }

    const wordCount = newEssay.content.trim().split(/\s+/).filter(w => w).length;
    createEssayMutation.mutate({ ...newEssay, wordCount } as any);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; text: string; textTr: string }> = {
      draft: { color: 'bg-gray-100 text-gray-800', text: 'Draft', textTr: 'Taslak' },
      submitted: { color: 'bg-blue-100 text-blue-800', text: 'Submitted', textTr: 'Gönderildi' },
      reviewed: { color: 'bg-purple-100 text-purple-800', text: 'Reviewed', textTr: 'İncelendi' },
      graded: { color: 'bg-green-100 text-green-800', text: 'Graded', textTr: 'Notlandırıldı' }
    };
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <Badge className={config.color}>
        {language === 'tr' ? config.textTr : config.text}
      </Badge>
    );
  };

  return (
    <PageWrapper
      currentPage={language === 'tr' ? 'Denemeler' : 'Essays'}
      pageTitle={language === 'tr' ? 'Deneme Yönetimi' : 'Essay Management'}
      showBackButton={true}
      backUrl="/"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {language === 'tr' ? 'Deneme Yönetimi' : 'Essay Management'}
              </h1>
              <p className="text-gray-600">
                {language === 'tr'
                  ? 'Denemelerinizi yazın, gönderin ve AI destekli geri bildirim alın'
                  : 'Write, submit, and receive AI-powered feedback on your essays'
                }
              </p>
            </div>
            <Button onClick={() => setShowCreateForm(true)} data-testid="button-create-essay">
              <FileText className="h-4 w-4 mr-2" />
              {language === 'tr' ? 'Yeni Deneme' : 'New Essay'}
            </Button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-essays">
                    {essays?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600">
                    {language === 'tr' ? 'Toplam Deneme' : 'Total Essays'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-draft-essays">
                    {essays?.filter(e => e.status === 'draft').length || 0}
                  </p>
                  <p className="text-sm text-gray-600">
                    {language === 'tr' ? 'Taslak' : 'Drafts'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Send className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-submitted-essays">
                    {essays?.filter(e => e.status === 'submitted' || e.status === 'reviewed').length || 0}
                  </p>
                  <p className="text-sm text-gray-600">
                    {language === 'tr' ? 'Gönderildi' : 'Submitted'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle2 className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-graded-essays">
                    {essays?.filter(e => e.status === 'graded').length || 0}
                  </p>
                  <p className="text-sm text-gray-600">
                    {language === 'tr' ? 'Notlandırıldı' : 'Graded'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Essays List */}
        <div className="grid grid-cols-1 gap-6">
          {isLoading && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">
                  {language === 'tr' ? 'Yükleniyor...' : 'Loading...'}
                </p>
              </CardContent>
            </Card>
          )}

          {essays && essays.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {language === 'tr' ? 'Henüz deneme yok' : 'No essays yet'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {language === 'tr'
                    ? 'İlk denemenizi oluşturun ve AI destekli geri bildirim alın'
                    : 'Create your first essay and receive AI-powered feedback'
                  }
                </p>
                <Button onClick={() => setShowCreateForm(true)} data-testid="button-create-first-essay">
                  {language === 'tr' ? 'İlk Denemenizi Oluşturun' : 'Create Your First Essay'}
                </Button>
              </CardContent>
            </Card>
          )}

          {essays?.map((essay, index) => (
            <motion.div
              key={essay.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card data-testid={`card-essay-${essay.id}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg" data-testid={`text-essay-title-${essay.id}`}>
                        {essay.title}
                      </CardTitle>
                      {essay.prompt && (
                        <CardDescription>{essay.prompt}</CardDescription>
                      )}
                    </div>
                    {getStatusBadge(essay.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {essay.content && (
                      <div>
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {essay.content}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      {essay.wordCount && (
                        <div>
                          <BookOpen className="h-4 w-4 inline mr-1" />
                          {essay.wordCount} {language === 'tr' ? 'kelime' : 'words'}
                        </div>
                      )}
                      {essay.submittedAt && (
                        <div>
                          <Clock className="h-4 w-4 inline mr-1" />
                          {new Date(essay.submittedAt).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}
                        </div>
                      )}
                      {essay.grade !== undefined && essay.grade !== null && (
                        <div className="font-medium text-green-700">
                          {language === 'tr' ? 'Not' : 'Grade'}: {essay.grade}/100
                        </div>
                      )}
                    </div>

                    {essay.aiFeedback && (
                      <>
                        <Separator />
                        <div className="bg-purple-50 p-4 rounded-lg" data-testid={`text-ai-feedback-${essay.id}`}>
                          <h4 className="font-semibold text-sm mb-2 text-purple-900">
                            {language === 'tr' ? 'AI Geri Bildirimi' : 'AI Feedback'}
                          </h4>
                          <p className="text-sm text-purple-800">{essay.aiFeedback}</p>
                        </div>
                      </>
                    )}

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedEssay(essay)}
                        data-testid={`button-view-${essay.id}`}
                      >
                        {language === 'tr' ? 'Görüntüle' : 'View'}
                      </Button>
                      {essay.status === 'draft' && (
                        <Button
                          size="sm"
                          onClick={() => submitEssayMutation.mutate(essay.id)}
                          disabled={submitEssayMutation.isPending}
                          data-testid={`button-submit-${essay.id}`}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          {language === 'tr' ? 'Gönder' : 'Submit'}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Create Essay Dialog */}
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {language === 'tr' ? 'Yeni Deneme Oluştur' : 'Create New Essay'}
              </DialogTitle>
              <DialogDescription>
                {language === 'tr'
                  ? 'Denemenizi yazın ve AI destekli geri bildirim alın'
                  : 'Write your essay and receive AI-powered feedback'
                }
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">{language === 'tr' ? 'Başlık' : 'Title'}</Label>
                <Input
                  id="title"
                  placeholder={language === 'tr' ? 'Deneme başlığı' : 'Essay title'}
                  value={newEssay.title}
                  onChange={(e) => setNewEssay({ ...newEssay, title: e.target.value })}
                  data-testid="input-essay-title"
                />
              </div>

              <div>
                <Label htmlFor="prompt">{language === 'tr' ? 'Soru / İpucu (Opsiyonel)' : 'Prompt (Optional)'}</Label>
                <Input
                  id="prompt"
                  placeholder={language === 'tr' ? 'Deneme sorusu veya ipucu' : 'Essay prompt or question'}
                  value={newEssay.prompt}
                  onChange={(e) => setNewEssay({ ...newEssay, prompt: e.target.value })}
                  data-testid="input-essay-prompt"
                />
              </div>

              <div>
                <Label htmlFor="content">{language === 'tr' ? 'İçerik' : 'Content'}</Label>
                <Textarea
                  id="content"
                  placeholder={language === 'tr' ? 'Denemenizi buraya yazın...' : 'Write your essay here...'}
                  value={newEssay.content}
                  onChange={(e) => setNewEssay({ ...newEssay, content: e.target.value })}
                  rows={12}
                  data-testid="input-essay-content"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {newEssay.content.trim().split(/\s+/).filter(w => w).length}{' '}
                  {language === 'tr' ? 'kelime' : 'words'}
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
                data-testid="button-cancel-essay"
              >
                {language === 'tr' ? 'İptal' : 'Cancel'}
              </Button>
              <Button
                onClick={handleCreateEssay}
                disabled={createEssayMutation.isPending}
                data-testid="button-save-essay"
              >
                {createEssayMutation.isPending
                  ? (language === 'tr' ? 'Oluşturuluyor...' : 'Creating...')
                  : (language === 'tr' ? 'Oluştur' : 'Create')
                }
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Essay Dialog */}
        <Dialog open={!!selectedEssay} onOpenChange={(open) => !open && setSelectedEssay(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedEssay && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedEssay.title}</DialogTitle>
                  {selectedEssay.prompt && (
                    <DialogDescription>{selectedEssay.prompt}</DialogDescription>
                  )}
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    {getStatusBadge(selectedEssay.status)}
                    {selectedEssay.wordCount && (
                      <span className="ml-2 text-sm text-gray-600">
                        {selectedEssay.wordCount} {language === 'tr' ? 'kelime' : 'words'}
                      </span>
                    )}
                  </div>

                  {selectedEssay.content && (
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-wrap">{selectedEssay.content}</p>
                    </div>
                  )}

                  {selectedEssay.aiFeedback && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2 text-purple-900">
                        {language === 'tr' ? 'AI Geri Bildirimi' : 'AI Feedback'}
                      </h4>
                      <p className="text-sm text-purple-800 whitespace-pre-wrap">
                        {selectedEssay.aiFeedback}
                      </p>
                    </div>
                  )}

                  {selectedEssay.instructorFeedback && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2 text-blue-900">
                        {language === 'tr' ? 'Eğitmen Geri Bildirimi' : 'Instructor Feedback'}
                      </h4>
                      <p className="text-sm text-blue-800 whitespace-pre-wrap">
                        {selectedEssay.instructorFeedback}
                      </p>
                    </div>
                  )}

                  {selectedEssay.grade !== undefined && selectedEssay.grade !== null && (
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                      <span className="font-semibold text-green-900">
                        {language === 'tr' ? 'Not' : 'Grade'}
                      </span>
                      <span className="text-2xl font-bold text-green-700">
                        {selectedEssay.grade}/100
                      </span>
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedEssay(null)}
                    data-testid="button-close-essay-dialog"
                  >
                    {language === 'tr' ? 'Kapat' : 'Close'}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageWrapper>
  );
}
