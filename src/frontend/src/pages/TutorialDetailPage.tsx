import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetTutorial } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, Package } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function TutorialDetailPage() {
  const { name } = useParams({ strict: false });
  const navigate = useNavigate();
  const { data: tutorial, isLoading } = useGetTutorial(name || '');

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-32 mb-6" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="font-serif text-3xl font-bold mb-4">Tutorial Not Found</h1>
        <Button onClick={() => navigate({ to: '/tutorials' })}>Back to Tutorials</Button>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" onClick={() => navigate({ to: '/tutorials' })} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Tutorials
      </Button>

      <article className="space-y-8">
        <header>
          <div className="flex items-center gap-3 mb-3">
            <h1 className="font-serif text-4xl font-bold text-foreground">{tutorial.title}</h1>
            <Badge variant="secondary" className="text-sm">
              {tutorial.difficulty}
            </Badge>
          </div>
          <p className="text-lg text-muted-foreground mb-4">{tutorial.description}</p>
          <p className="text-sm text-muted-foreground">
            {tutorial.steps.length} steps • {tutorial.materials.length} materials needed
          </p>
        </header>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-primary" />
              <CardTitle className="font-serif text-2xl">Materials Needed</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {tutorial.materials.map((material, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-foreground">{material}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/tutorial-icon.dim_128x128.png"
                alt="Instructions"
                className="w-10 h-10"
              />
              <CardTitle className="font-serif text-2xl">Step-by-Step Instructions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {tutorial.steps.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-foreground">{step}</p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Ready to start this project?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Gather your materials and follow the steps above. Happy crocheting!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </article>
    </main>
  );
}
