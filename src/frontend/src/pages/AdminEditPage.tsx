import { useNavigate, useParams } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useGetTutorial, useUpdateTutorial, useIsCallerAdmin } from '../hooks/useQueries';
import { toast } from 'sonner';
import TutorialForm from '../components/TutorialForm';

export default function AdminEditPage() {
  const navigate = useNavigate();
  const { title } = useParams({ from: '/admin/edit/$title' });
  const { data: tutorial, isLoading } = useGetTutorial(title);
  const updateTutorial = useUpdateTutorial();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();

  const handleSubmit = async (data: {
    title: string;
    description: string;
    difficulty: string;
    steps: string[];
    materials: string[];
  }) => {
    try {
      await updateTutorial.mutateAsync(data);
      toast.success('Tutorial updated successfully!');
      navigate({ to: '/admin' });
    } catch (error) {
      toast.error('Failed to update tutorial');
      console.error(error);
    }
  };

  const handleCancel = () => {
    navigate({ to: '/admin' });
  };

  if (isAdminLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
            <CardDescription>You do not have permission to access this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate({ to: '/' })} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Tutorial Not Found</CardTitle>
            <CardDescription>The tutorial you're looking for doesn't exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate({ to: '/admin' })} className="w-full">
              Back to Admin
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button variant="ghost" onClick={() => navigate({ to: '/admin' })} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Admin
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-3xl">Edit Tutorial</CardTitle>
          <CardDescription>Update the tutorial details</CardDescription>
        </CardHeader>
        <CardContent>
          <TutorialForm tutorial={tutorial} onSubmit={handleSubmit} onCancel={handleCancel} isSubmitting={updateTutorial.isPending} />
        </CardContent>
      </Card>
    </div>
  );
}
