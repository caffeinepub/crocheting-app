import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useNavigate } from '@tanstack/react-router';
import { Badge } from '@/components/ui/badge';
import type { Project } from '../backend';
import { useGetUserProfile } from '../hooks/useQueries';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();
  const { data: creatorProfile } = useGetUserProfile(project.creator);

  const thumbnailUrl = project.images[0]?.getDirectURL();

  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
      onClick={() => navigate({ to: `/projects/${project.title}` })}
    >
      {thumbnailUrl && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img src={thumbnailUrl} alt={project.title} className="w-full h-full object-cover" />
        </div>
      )}
      <CardHeader>
        <CardTitle className="font-serif text-xl">{project.title}</CardTitle>
        <CardDescription>by {creatorProfile?.name || 'Anonymous'}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{project.description}</p>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{Number(project.completion_percentage)}% Complete</Badge>
          {project.materials.length > 0 && (
            <Badge variant="outline">{project.materials.length} materials</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
