import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, Plus, Search, BookOpen, Users, Target, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/consolidated-language-context";
import { motion } from "framer-motion";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  type?: 'courses' | 'assignments' | 'achievements' | 'challenges' | 'search' | 'generic';
  searchQuery?: string;
}

export function EmptyState({ 
  icon: CustomIcon, 
  title,
  description,
  actionLabel,
  onAction,
  type = 'generic',
  searchQuery
}: EmptyStateProps) {
  const { t } = useLanguage();

  const getEmptyStateConfig = () => {
    switch (type) {
      case 'courses':
        return {
          icon: BookOpen,
          title: title || t('noCoursesTitle', 'No Courses Found'),
          description: description || t('noCoursesDesc', 'Start your learning journey by exploring our course catalog.'),
          actionLabel: actionLabel || t('exploreCourses', 'Explore Courses'),
          iconColor: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-100 dark:bg-blue-900/30'
        };
      case 'assignments':
        return {
          icon: Calendar,
          title: title || t('noAssignmentsTitle', 'No Assignments'),
          description: description || t('noAssignmentsDesc', 'You\'re all caught up! No pending assignments at the moment.'),
          actionLabel: actionLabel || t('viewCourses', 'View Courses'),
          iconColor: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-100 dark:bg-green-900/30'
        };
      case 'achievements':
        return {
          icon: Target,
          title: title || t('noAchievementsTitle', 'No Achievements Yet'),
          description: description || t('noAchievementsDesc', 'Complete courses and challenges to unlock your first achievement!'),
          actionLabel: actionLabel || t('startLearning', 'Start Learning'),
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/30'
        };
      case 'challenges':
        return {
          icon: Target,
          title: title || t('noChallengesTitle', 'No Active Challenges'),
          description: description || t('noChallengesDesc', 'Challenge yourself with skill-building exercises and competitions.'),
          actionLabel: actionLabel || t('browseChallenges', 'Browse Challenges'),
          iconColor: 'text-purple-600 dark:text-purple-400',
          bgColor: 'bg-purple-100 dark:bg-purple-900/30'
        };
      case 'search':
        return {
          icon: Search,
          title: title || t('noSearchResultsTitle', `No results for "${searchQuery || ''}"`),
          description: description || t('noSearchResultsDesc', 'Try adjusting your search terms or browse our recommendations.'),
          actionLabel: actionLabel || t('clearSearch', 'Clear Search'),
          iconColor: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-100 dark:bg-gray-900/30'
        };
      default:
        return {
          icon: Users,
          title: title || t('noDataTitle', 'No Data Available'),
          description: description || t('noDataDesc', 'There\'s nothing to show here at the moment.'),
          actionLabel: actionLabel || t('refresh', 'Refresh'),
          iconColor: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-100 dark:bg-gray-900/30'
        };
    }
  };

  const config = getEmptyStateConfig();
  const Icon = CustomIcon || config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full"
    >
      <Card className="border-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <motion.div 
            className={`mx-auto w-20 h-20 ${config.bgColor} rounded-full flex items-center justify-center mb-6`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Icon className={`h-10 w-10 ${config.iconColor}`} />
          </motion.div>
          
          <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {config.title}
          </CardTitle>
          
          <CardDescription className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
            {config.description}
          </CardDescription>
        </CardHeader>
        
        {onAction && config.actionLabel && (
          <CardContent className="text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button 
                onClick={onAction}
                className="px-6"
                data-testid={`button-empty-action-${type}`}
              >
                <Plus className="h-4 w-4 mr-2" />
                {config.actionLabel}
              </Button>
            </motion.div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}