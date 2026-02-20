import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from '@tanstack/react-router';
import { BookOpen } from 'lucide-react';
import type { Tutorial } from '../backend';

interface TutorialCardProps {
  tutorial: Tutorial;
}

export default function TutorialCard({ tutorial }: TutorialCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: `/tutorials/${tutorial.title}` })}>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="font-serif text-xl mb-1">{tutorial.title}</CardTitle>
            <CardDescription>
              {tutorial.steps.length} steps • {tutorial.materials.length} materials
            </CardDescription>
          </div>
        </div>
        <Badge variant="secondary" className="w-fit mt-2">
          {tutorial.difficulty}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{tutorial.description}</p>
        <Button variant="outline" className="w-full">
          View Tutorial
        </Button>
      </CardContent>
    </Card>
  );
}
