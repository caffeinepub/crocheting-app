import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import type { Tutorial } from '../backend';

interface TutorialFormProps {
  tutorial?: Tutorial;
  onSubmit: (data: {
    title: string;
    description: string;
    difficulty: string;
    steps: string[];
    materials: string[];
  }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function TutorialForm({ tutorial, onSubmit, onCancel, isSubmitting = false }: TutorialFormProps) {
  const [title, setTitle] = useState(tutorial?.title || '');
  const [description, setDescription] = useState(tutorial?.description || '');
  const [difficulty, setDifficulty] = useState(tutorial?.difficulty || 'Beginner');
  const [steps, setSteps] = useState<string[]>(tutorial?.steps || ['']);
  const [materials, setMaterials] = useState<string[]>(tutorial?.materials || ['']);

  useEffect(() => {
    if (tutorial) {
      setTitle(tutorial.title);
      setDescription(tutorial.description);
      setDifficulty(tutorial.difficulty);
      setSteps(tutorial.steps.length > 0 ? tutorial.steps : ['']);
      setMaterials(tutorial.materials.length > 0 ? tutorial.materials : ['']);
    }
  }, [tutorial]);

  const addStep = () => {
    setSteps([...steps, '']);
  };

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  const updateStep = (index: number, value: string) => {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  };

  const addMaterial = () => {
    setMaterials([...materials, '']);
  };

  const removeMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const updateMaterial = (index: number, value: string) => {
    const updated = [...materials];
    updated[index] = value;
    setMaterials(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    const validSteps = steps.filter((s) => s.trim() !== '');
    if (validSteps.length === 0) {
      return;
    }

    const validMaterials = materials.filter((m) => m.trim() !== '');

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      difficulty,
      steps: validSteps,
      materials: validMaterials,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Tutorial Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Granny Square"
          required
          disabled={!!tutorial}
          className="mt-1"
        />
        {tutorial && <p className="text-xs text-muted-foreground mt-1">Title cannot be changed when editing</p>}
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what this tutorial teaches..."
          required
          className="mt-1 min-h-[100px]"
        />
      </div>

      <div>
        <Label htmlFor="difficulty">Difficulty Level *</Label>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger id="difficulty" className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Steps *</Label>
          <Button type="button" variant="outline" size="sm" onClick={addStep}>
            <Plus className="w-4 h-4 mr-2" />
            Add Step
          </Button>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => (
            <Card key={index}>
              <CardContent className="pt-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor={`step-${index}`} className="text-sm">
                      Step {index + 1}
                    </Label>
                    <Textarea
                      id={`step-${index}`}
                      value={step}
                      onChange={(e) => updateStep(index, e.target.value)}
                      placeholder="Describe this step..."
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                  {steps.length > 1 && (
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStep(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Materials</Label>
          <Button type="button" variant="outline" size="sm" onClick={addMaterial}>
            <Plus className="w-4 h-4 mr-2" />
            Add Material
          </Button>
        </div>

        <div className="space-y-3">
          {materials.map((material, index) => (
            <Card key={index}>
              <CardContent className="pt-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor={`material-${index}`} className="text-sm">
                      Material {index + 1}
                    </Label>
                    <Input
                      id={`material-${index}`}
                      value={material}
                      onChange={(e) => updateMaterial(index, e.target.value)}
                      placeholder="e.g., Worsted weight yarn"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMaterial(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {materials.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No materials added yet. Click "Add Material" to get started.
          </p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : tutorial ? 'Update Tutorial' : 'Create Tutorial'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
