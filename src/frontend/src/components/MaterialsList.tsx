import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Material } from '../backend';

interface MaterialsListProps {
  materials: Material[];
}

export default function MaterialsList({ materials }: MaterialsListProps) {
  if (materials.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <img
            src="/assets/generated/materials-icon.dim_128x128.png"
            alt="Materials"
            className="w-10 h-10"
          />
          <CardTitle className="font-serif text-2xl">Materials Needed</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Material</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Unit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.map((material, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{material.name}</TableCell>
                <TableCell className="text-right">{Number(material.quantity)}</TableCell>
                <TableCell className="text-right">{material.unit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
