import { useGetTutorials } from '../hooks/useQueries';
import TutorialCard from '../components/TutorialCard';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen } from 'lucide-react';

export default function TutorialsPage() {
  const { data: tutorials, isLoading } = useGetTutorials();

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="flex items-center gap-4 mb-8">
        <img src="/assets/generated/tutorial-icon.dim_128x128.png" alt="Tutorials" className="w-16 h-16" />
        <div>
          <h1 className="font-serif text-4xl font-bold text-foreground">Crochet Tutorials & Patterns</h1>
          <p className="text-muted-foreground mt-1">Learn new patterns and techniques step by step</p>
        </div>
      </header>

      {isLoading ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </section>
      ) : tutorials && tutorials.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((tutorial) => (
            <article key={tutorial.title}>
              <TutorialCard tutorial={tutorial} />
            </article>
          ))}
        </section>
      ) : (
        <section className="text-center py-16">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">No Tutorials Yet</h2>
          <p className="text-muted-foreground">Check back soon for new crochet patterns and tutorials!</p>
        </section>
      )}
    </main>
  );
}
