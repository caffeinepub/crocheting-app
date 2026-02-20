import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useAddProject } from '../hooks/useQueries';
import { toast } from 'sonner';
import ImageUploader from '../components/ImageUploader';
import MaterialsInput from '../components/MaterialsInput';
import type { ExternalBlob, Material } from '../backend';

export default function PublishProjectPage() {
  const navigate = useNavigate();
  const addProject = useAddProject();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [images, setImages] = useState<ExternalBlob[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter a project title');
      return;
    }

    if (!description.trim()) {
      toast.error('Please enter a project description');
      return;
    }

    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    try {
      await addProject.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        instructions: instructions.trim(),
        images,
        materials,
      });

      toast.success('Project published successfully!');
      navigate({ to: '/my-projects' });
    } catch (error) {
      toast.error('Failed to publish project');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button variant="ghost" onClick={() => navigate({ to: '/my-projects' })} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-3xl">Publish Your Project</CardTitle>
          <CardDescription>Share your crochet creation with the community</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Cozy Blanket"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project, what inspired you, and any special techniques you used..."
                required
                className="mt-1 min-h-[120px]"
              />
            </div>

            <div>
              <Label htmlFor="instructions">Instructions (Optional)</Label>
              <Textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Share step-by-step instructions for others to recreate your project..."
                className="mt-1 min-h-[120px]"
              />
            </div>

            <div>
              <Label className="mb-2 block">Project Images *</Label>
              <ImageUploader images={images} onChange={setImages} maxImages={5} />
            </div>

            <MaterialsInput materials={materials} onChange={setMaterials} />

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={addProject.isPending}>
                {addProject.isPending ? 'Publishing...' : 'Publish Project'}
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
