import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetMyProjects, useUpdateProject } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import ProgressBar from '../components/ProgressBar';
import ImageUploader from '../components/ImageUploader';
import type { ExternalBlob } from '../backend';
import { Skeleton } from '@/components/ui/skeleton';

export default function TrackProjectPage() {
  const { title } = useParams({ strict: false });
  const navigate = useNavigate();
  const { data: projects, isLoading } = useGetMyProjects();
  const updateProject = useUpdateProject();

  const project = projects?.find((p) => p.title === title);

  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [timeSpentMinutes, setTimeSpentMinutes] = useState(0);
  const [images, setImages] = useState<ExternalBlob[]>([]);

  useEffect(() => {
    if (project) {
      setCompletionPercentage(Number(project.completion_percentage));
      setTimeSpentMinutes(Number(project.time_spent_minutes));
      setImages(project.images);
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!project) return;

    try {
      await updateProject.mutateAsync({
        title: project.title,
        images,
        completion_percentage: BigInt(completionPercentage),
        time_spent_minutes: BigInt(timeSpentMinutes),
      });

      toast.success('Project updated successfully!');
      navigate({ to: '/my-projects' });
    } catch (error) {
      toast.error('Failed to update project');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Skeleton className="h-10 w-32 mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="font-serif text-3xl font-bold mb-4">Project Not Found</h1>
        <Button onClick={() => navigate({ to: '/my-projects' })}>Back to My Projects</Button>
      </div>
    );
  }

  const timeSpentHours = Math.floor(timeSpentMinutes / 60);
  const remainingMinutes = timeSpentMinutes % 60;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button variant="ghost" onClick={() => navigate({ to: '/my-projects' })} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to My Projects
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-3xl">Update Progress</CardTitle>
          <CardDescription>{project.title}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="mb-3 block">Current Progress</Label>
              <ProgressBar percentage={completionPercentage} />
            </div>

            <div>
              <Label htmlFor="completion">Completion Percentage: {completionPercentage}%</Label>
              <Slider
                id="completion"
                min={0}
                max={100}
                step={5}
                value={[completionPercentage]}
                onValueChange={(value) => setCompletionPercentage(value[0])}
                className="mt-3"
              />
            </div>

            <div>
              <Label htmlFor="time">
                Time Spent: {timeSpentHours > 0 && `${timeSpentHours}h `}
                {remainingMinutes}m
              </Label>
              <Input
                id="time"
                type="number"
                min="0"
                value={timeSpentMinutes}
                onChange={(e) => setTimeSpentMinutes(parseInt(e.target.value) || 0)}
                placeholder="Total minutes spent"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">Enter total time in minutes</p>
            </div>

            <div>
              <Label className="mb-2 block">Project Images</Label>
              <ImageUploader images={images} onChange={setImages} maxImages={5} />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={updateProject.isPending}>
                {updateProject.isPending ? 'Updating...' : 'Update Progress'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate({ to: '/my-projects' })}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
