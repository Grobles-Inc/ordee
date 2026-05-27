import { useCallback, useState } from "react";
import { Button } from "~/components/ui/button";
import { ImagePlus, X } from "lucide-react";
import { cn } from "~/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (file: File | null) => void;
  onClear?: () => void;
  disabled?: boolean;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  onClear,
  disabled,
  className,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value ?? null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange(file);
    },
    [onChange]
  );

  const handleClear = useCallback(() => {
    setPreview(null);
    onChange(null);
    onClear?.();
  }, [onChange, onClear]);

  return (
    <div className={cn("space-y-2", className)}>
      {preview ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          <img
            src={preview}
            alt="Preview"
            className="h-full w-full object-cover"
          />
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <label className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed transition-colors hover:bg-muted/50">
          <ImagePlus className="h-8 w-8 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Click to upload image
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={disabled}
          />
        </label>
      )}
    </div>
  );
}
