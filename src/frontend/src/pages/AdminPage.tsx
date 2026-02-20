import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import { useGetTutorials, useDeleteTutorial, useIsCallerAdmin } from '../hooks/useQueries';
import { toast } from 'sonner';
import type { Tutorial } from '../backend';

export default function AdminPage() {
  const navigate = useNavigate();
  const { data: tutorials = [], isLoading } = useGetTutorials();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const deleteTutorial = useDeleteTutorial();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tutorialToDelete, setTutorialToDelete] = useState<Tutorial | null>(null);

  const handleDeleteClick = (tutorial: Tutorial) => {
    setTutorialToDelete(tutorial);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!tutorialToDelete) return;

    try {
      await deleteTutorial.mutateAsync(tutorialToDelete.title);
      toast.success('Tutorial deleted successfully');
      setDeleteDialogOpen(false);
      setTutorialToDelete(null);
    } catch (error) {
      toast.error('Failed to delete tutorial');
      console.error(error);
    }
  };

  const handleEdit = (tutorial: Tutorial) => {
    navigate({ to: '/admin/edit/$title', params: { title: tutorial.title } });
  };

  const handleCreate = () => {
    navigate({ to: '/admin/create' });
  };

  if (isAdminLoading) {
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

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl font-bold text-primary mb-2">Tutorial Management</h1>
            <p className="text-muted-foreground">Create, edit, and manage crochet tutorials</p>
          </div>
          <Button onClick={handleCreate} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Add New Tutorial
          </Button>
        </div>
      </header>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading tutorials...</p>
        </div>
      ) : tutorials.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No Tutorials Yet</h2>
            <p className="text-muted-foreground mb-6">Get started by creating your first tutorial</p>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Create Tutorial
            </Button>
          </CardContent>
        </Card>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((tutorial) => (
            <article key={tutorial.title}>
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="font-serif text-xl">{tutorial.title}</CardTitle>
                    <Badge variant={tutorial.difficulty === 'Beginner' ? 'default' : tutorial.difficulty === 'Intermediate' ? 'secondary' : 'outline'}>
                      {tutorial.difficulty}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{tutorial.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-end">
                  <div className="text-sm text-muted-foreground mb-4">
                    <p>{tutorial.steps.length} steps • {tutorial.materials.length} materials</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(tutorial)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteClick(tutorial)}
                      disabled={deleteTutorial.isPending}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </article>
          ))}
        </section>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tutorial</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{tutorialToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteTutorial.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
