import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetPattern } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import MaterialsList from '../components/MaterialsList';
import { Skeleton } from '@/components/ui/skeleton';

export default function TutorialDetailPage() {
  const { name } = useParams({ strict: false });
  const navigate = useNavigate();
  const { data: pattern, isLoading } = useGetPattern(name || '');

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-32 mb-6" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!pattern) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="font-serif text-3xl font-bold mb-4">Tutorial Not Found</h1>
        <Button onClick={() => navigate({ to: '/tutorials' })}>Back to Tutorials</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" onClick={() => navigate({ to: '/tutorials' })} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Tutorials
      </Button>

      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-4xl font-bold text-foreground mb-2">{pattern.name}</h1>
          <p className="text-muted-foreground">
            {pattern.pattern_steps.length} steps • {pattern.materials_needed.length} materials needed
          </p>
        </div>

        <MaterialsList materials={pattern.materials_needed} />

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
              {pattern.pattern_steps.map((step, index) => (
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
      </div>
    </div>
  );
}
