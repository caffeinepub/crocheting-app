import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetAllProjects, useGetUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, User } from 'lucide-react';
import MaterialsList from '../components/MaterialsList';
import ProgressBar from '../components/ProgressBar';
import { Skeleton } from '@/components/ui/skeleton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export default function ProjectDetailPage() {
  const { title } = useParams({ strict: false });
  const navigate = useNavigate();
  const { data: projects, isLoading } = useGetAllProjects();

  const project = projects?.find((p) => p.title === title);
  const { data: creatorProfile } = useGetUserProfile(project?.creator);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-32 mb-6" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="font-serif text-3xl font-bold mb-4">Project Not Found</h1>
        <Button onClick={() => navigate({ to: '/projects' })}>Back to Gallery</Button>
      </div>
    );
  }

  const timeSpentHours = Math.floor(Number(project.time_spent_minutes) / 60);
  const timeSpentMinutes = Number(project.time_spent_minutes) % 60;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Button variant="ghost" onClick={() => navigate({ to: '/projects' })} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Gallery
      </Button>

      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-4xl font-bold text-foreground mb-3">{project.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>by {creatorProfile?.name || 'Anonymous'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>
                {timeSpentHours > 0 && `${timeSpentHours}h `}
                {timeSpentMinutes}m spent
              </span>
            </div>
            <Badge variant="secondary">{Number(project.completion_percentage)}% Complete</Badge>
          </div>
        </div>

        {project.images.length > 0 && (
          <div className="relative">
            {project.images.length === 1 ? (
              <div className="rounded-2xl overflow-hidden">
                <img
                  src={project.images[0].getDirectURL()}
                  alt={project.title}
                  className="w-full max-h-[600px] object-cover"
                />
              </div>
            ) : (
              <Carousel className="w-full">
                <CarouselContent>
                  {project.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="rounded-2xl overflow-hidden">
                        <img
                          src={image.getDirectURL()}
                          alt={`${project.title} - Image ${index + 1}`}
                          className="w-full max-h-[600px] object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            )}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressBar percentage={Number(project.completion_percentage)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground whitespace-pre-wrap">{project.description}</p>
          </CardContent>
        </Card>

        {project.instructions && (
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground whitespace-pre-wrap">{project.instructions}</p>
            </CardContent>
          </Card>
        )}

        <MaterialsList materials={project.materials} />

        {creatorProfile?.bio && (
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="font-serif text-xl">About the Creator</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{creatorProfile.bio}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
