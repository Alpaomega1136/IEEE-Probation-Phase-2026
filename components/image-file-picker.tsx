import { Upload } from "lucide-react";

export function ImageFilePicker({
  id,
  fileName,
  disabled = false,
  onChange,
}: {
  id: string;
  fileName?: string;
  disabled?: boolean;
  onChange: (file: File | null) => void;
}) {
  return (
    <div className="image-file-picker">
      <input
        id={id}
        className="image-file-input"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={disabled}
        aria-describedby={`${id}-hint ${id}-name`}
        onChange={(event) => {
          onChange(event.target.files?.[0] ?? null);
          event.target.value = "";
        }}
      />
      <label htmlFor={id} className="image-file-trigger">
        <Upload size={17} />
        Choose photo
      </label>
      <span id={`${id}-name`} className="image-file-name">
        {fileName || "No photo selected"}
      </span>
      <small id={`${id}-hint`}>JPEG, PNG, or WebP | Max 5 MB</small>
    </div>
  );
}
