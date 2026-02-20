import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import type { Material } from '../backend';

interface MaterialsInputProps {
  materials: Material[];
  onChange: (materials: Material[]) => void;
}

export default function MaterialsInput({ materials, onChange }: MaterialsInputProps) {
  const addMaterial = () => {
    onChange([...materials, { name: '', quantity: BigInt(1), unit: '' }]);
  };

  const removeMaterial = (index: number) => {
    onChange(materials.filter((_, i) => i !== index));
  };

  const updateMaterial = (index: number, field: keyof Material, value: string | bigint) => {
    const updated = [...materials];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2">
                  <Label htmlFor={`material-name-${index}`} className="text-sm">
                    Name
                  </Label>
                  <Input
                    id={`material-name-${index}`}
                    value={material.name}
                    onChange={(e) => updateMaterial(index, 'name', e.target.value)}
                    placeholder="e.g., Worsted weight yarn"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`material-quantity-${index}`} className="text-sm">
                    Quantity
                  </Label>
                  <Input
                    id={`material-quantity-${index}`}
                    type="number"
                    min="1"
                    value={Number(material.quantity)}
                    onChange={(e) => updateMaterial(index, 'quantity', BigInt(e.target.value || 1))}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor={`material-unit-${index}`} className="text-sm">
                      Unit
                    </Label>
                    <Input
                      id={`material-unit-${index}`}
                      value={material.unit}
                      onChange={(e) => updateMaterial(index, 'unit', e.target.value)}
                      placeholder="e.g., skeins"
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
  );
}
