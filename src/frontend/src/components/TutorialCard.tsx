import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { BookOpen } from 'lucide-react';
import type { CrochetPattern } from '../backend';

interface TutorialCardProps {
  pattern: CrochetPattern;
}

export default function TutorialCard({ pattern }: TutorialCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: `/tutorials/${pattern.name}` })}>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="font-serif text-xl mb-1">{pattern.name}</CardTitle>
            <CardDescription>
              {pattern.pattern_steps.length} steps • {pattern.materials_needed.length} materials
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button variant="outline" className="w-full">
          View Tutorial
        </Button>
      </CardContent>
    </Card>
  );
}
