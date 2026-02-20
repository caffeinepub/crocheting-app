import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { ExternalBlob } from '../backend';

interface ImageUploaderProps {
  images: ExternalBlob[];
  onChange: (images: ExternalBlob[]) => void;
  maxImages?: number;
}

export default function ImageUploader({ images, onChange, maxImages = 5 }: ImageUploaderProps) {
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files) return;

      const fileArray = Array.from(files);
      const remainingSlots = maxImages - images.length;

      if (fileArray.length > remainingSlots) {
        alert(`You can only upload ${remainingSlots} more image(s)`);
        return;
      }

      const newBlobs: ExternalBlob[] = [];

      for (const file of fileArray) {
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} is not an image file`);
          continue;
        }

        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress((prev) => ({ ...prev, [file.name]: percentage }));
        });

        newBlobs.push(blob);
      }

      onChange([...images, ...newBlobs]);

      // Clear progress after a delay
      setTimeout(() => {
        setUploadProgress({});
      }, 1000);
    },
    [images, maxImages, onChange]
  );

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((blob, index) => (
          <Card key={index} className="relative group">
            <CardContent className="p-2">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <img src={blob.getDirectURL()} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}

        {images.length < maxImages && (
          <Card className="border-dashed cursor-pointer hover:border-primary transition-colors">
            <CardContent className="p-2">
              <label className="aspect-square flex flex-col items-center justify-center cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground text-center">Upload Image</span>
              </label>
            </CardContent>
          </Card>
        )}
      </div>

      {Object.entries(uploadProgress).map(([filename, progress]) => (
        <div key={filename} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground truncate">{filename}</span>
            <span className="text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-1" />
        </div>
      ))}

      <p className="text-xs text-muted-foreground">
        {images.length} / {maxImages} images uploaded
      </p>
    </div>
  );
}
