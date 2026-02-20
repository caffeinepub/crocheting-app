import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetMyProjects } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ActiveProjectCard from '../components/ActiveProjectCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function MyProjectsPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: projects, isLoading } = useGetMyProjects();

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="font-serif text-3xl font-bold mb-4">Please Log In</h1>
        <p className="text-muted-foreground mb-6">You need to be logged in to view your projects.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <img src="/assets/generated/tracking-icon.dim_128x128.png" alt="My Projects" className="w-16 h-16" />
          <div>
            <h1 className="font-serif text-4xl font-bold text-foreground">My Projects</h1>
            <p className="text-muted-foreground mt-1">Track your progress and manage your crochet projects</p>
          </div>
        </div>
        <Button onClick={() => navigate({ to: '/publish' })}>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ActiveProjectCard key={`${project.title}-${index}`} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <img
            src="/assets/generated/tracking-icon.dim_128x128.png"
            alt="No projects"
            className="w-24 h-24 mx-auto mb-4 opacity-50"
          />
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">No Projects Yet</h2>
          <p className="text-muted-foreground mb-6">Start your first crochet project and track your progress!</p>
          <Button onClick={() => navigate({ to: '/publish' })}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Project
          </Button>
        </div>
      )}
    </div>
  );
}
