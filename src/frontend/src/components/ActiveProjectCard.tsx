import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Clock, Edit } from 'lucide-react';
import type { Project } from '../backend';
import ProgressBar from './ProgressBar';

interface ActiveProjectCardProps {
  project: Project;
}

export default function ActiveProjectCard({ project }: ActiveProjectCardProps) {
  const navigate = useNavigate();
  const thumbnailUrl = project.images[0]?.getDirectURL();
  const timeSpentHours = Math.floor(Number(project.time_spent_minutes) / 60);
  const timeSpentMinutes = Number(project.time_spent_minutes) % 60;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-3">
          {thumbnailUrl && (
            <img
              src={thumbnailUrl}
              alt={project.title}
              className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <CardTitle className="font-serif text-xl mb-1">{project.title}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {timeSpentHours > 0 && `${timeSpentHours}h `}
              {timeSpentMinutes}m spent
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProgressBar percentage={Number(project.completion_percentage)} />
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate({ to: `/track/${project.title}` })}
          >
            <Edit className="w-4 h-4 mr-2" />
            Update Progress
          </Button>
          <Button variant="outline" onClick={() => navigate({ to: `/projects/${project.title}` })}>
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
