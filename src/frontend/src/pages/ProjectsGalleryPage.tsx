import { useGetAllProjects } from '../hooks/useQueries';
import ProjectCard from '../components/ProjectCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Image as ImageIcon } from 'lucide-react';

export default function ProjectsGalleryPage() {
  const { data: projects, isLoading } = useGetAllProjects();

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-foreground mb-2">Community Projects Gallery</h1>
        <p className="text-muted-foreground">Explore beautiful crochet projects from our community</p>
      </header>

      {isLoading ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-lg" />
          ))}
        </section>
      ) : projects && projects.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <article key={`${project.title}-${index}`}>
              <ProjectCard project={project} />
            </article>
          ))}
        </section>
      ) : (
        <section className="text-center py-16">
          <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">No Projects Yet</h2>
          <p className="text-muted-foreground">Be the first to share your crochet creation!</p>
        </section>
      )}
    </main>
  );
}
