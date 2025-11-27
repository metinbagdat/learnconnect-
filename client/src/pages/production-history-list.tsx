import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Clock, TrendingUp, BookOpen, Trash2, Copy, BarChart3, Download, ArrowRight
} from 'lucide-react';

export default function ProductionHistoryList() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch productions
  const { data: productions = [] } = useQuery<any[]>({
    queryKey: ['/api/production/list'],
    enabled: !!user
  });

  // Delete production mutation
  const deleteMutation = useMutation({
    mutationFn: (productionId: string) =>
      apiRequest('DELETE', `/api/production/${productionId}`, {}),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Production deleted' });
      queryClient.invalidateQueries({ queryKey: ['/api/production/list'] });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete production', variant: 'destructive' });
    }
  });

  // Clone production mutation
  const cloneMutation = useMutation({
    mutationFn: (productionId: string) =>
      apiRequest('POST', `/api/production/${productionId}/clone`, {}),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Production cloned successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/production/list'] });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to clone production', variant: 'destructive' });
    }
  });

  // Filter and search productions
  const filteredProductions = useMemo(() => {
    let filtered = [...productions];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(prod =>
        (prod.selectedCurriculum?.title || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType === 'recent') {
      filtered = filtered.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (filterType === 'high-confidence') {
      filtered = filtered.filter(prod => (prod.aiConfidenceScore || 0) > 0.75);
    } else if (filterType === 'implemented') {
      filtered = filtered.filter(prod => prod.isImplemented === true);
    }

    return filtered;
  }, [productions, searchQuery, filterType]);

  // Pagination
  const totalPages = Math.ceil(filteredProductions.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedProductions = filteredProductions.slice(startIdx, startIdx + itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold">Production History</h1>
          </div>
          <p className="text-gray-600">View and manage your curriculum productions</p>
        </div>

        {/* Controls */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search productions..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                data-testid="input-search-productions"
              />
            </div>
            <Select value={filterType} onValueChange={(value) => {
              setFilterType(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-full md:w-48" data-testid="select-filter-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Productions</SelectItem>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="high-confidence">High Confidence</SelectItem>
                <SelectItem value="implemented">Implemented</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Results Info */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {paginatedProductions.length > 0 ? startIdx + 1 : 0} to {Math.min(startIdx + itemsPerPage, filteredProductions.length)} of {filteredProductions.length} productions
          </p>
        </div>

        {/* Production Grid */}
        {paginatedProductions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {paginatedProductions.map((production: any, idx: number) => (
              <Card key={production.id} className="p-6 hover:shadow-lg transition" data-testid={`card-production-${idx}`}>
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {production.selectedCurriculum?.title || `Production ${idx + 1}`}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Clock className="w-4 h-4" />
                      {formatDate(production.createdAt)}
                    </p>
                  </div>
                  {production.isImplemented && (
                    <Badge className="bg-green-100 text-green-800">Implemented</Badge>
                  )}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600">
                      {Math.round((production.aiConfidenceScore || 0.8) * 100)}%
                    </div>
                    <div className="text-xs text-gray-600">AI Confidence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">
                      {production.selectedCurriculum?.estimatedDuration || 0}h
                    </div>
                    <div className="text-xs text-gray-600">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-600">
                      {production.selectedCurriculum?.courses?.length || 0}
                    </div>
                    <div className="text-xs text-gray-600">Courses</div>
                  </div>
                </div>

                {/* Preview */}
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium mb-2 flex items-center gap-1">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    Learning Path
                  </p>
                  <div className="space-y-1">
                    {production.selectedCurriculum?.courses?.slice(0, 3).map((course: any, cidx: number) => (
                      <div key={cidx} className="text-xs text-gray-700 flex items-center gap-2">
                        <span className="font-semibold text-blue-600">{cidx + 1}.</span>
                        <span>{course.titleEn || course.title}</span>
                      </div>
                    ))}
                    {(production.selectedCurriculum?.courses?.length || 0) > 3 && (
                      <div className="text-xs text-gray-500 font-medium">
                        +{production.selectedCurriculum.courses.length - 3} more courses
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => cloneMutation.mutate(production.id)}
                    disabled={cloneMutation.isPending}
                    data-testid={`button-clone-${idx}`}
                  >
                    <Copy className="w-4 h-4" />
                    Clone
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      apiRequest('GET', `/api/production/${production.id}/export`, {})
                        .then(() => toast({ title: 'Success', description: 'Production exported' }))
                        .catch(() => toast({ title: 'Error', description: 'Failed to export', variant: 'destructive' }));
                    }}
                    data-testid={`button-export-${idx}`}
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      apiRequest('GET', `/api/production/${production.id}/stats`, {})
                        .then(() => toast({ title: 'Success', description: 'Stats loaded' }))
                        .catch(() => toast({ title: 'Error', description: 'Failed to load stats', variant: 'destructive' }));
                    }}
                    data-testid={`button-analyze-${idx}`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    Analyze
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-red-600 hover:text-red-700"
                    onClick={() => deleteMutation.mutate(production.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-${idx}`}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No productions found</p>
            <p className="text-gray-500 text-sm mt-2">
              {searchQuery ? 'Try adjusting your search filters' : 'Generate a curriculum to see productions here'}
            </p>
          </Card>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              data-testid="button-prev-page"
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                onClick={() => setCurrentPage(page)}
                size="sm"
                data-testid={`button-page-${page}`}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              data-testid="button-next-page"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
