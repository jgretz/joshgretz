import {type DragEvent, useCallback, useEffect, useId, useRef, useState} from 'react';
import {slugFromFilename} from '../../lib/slug';
import {Button} from '../ui/button';

const IMAGE_EXT = ['png', 'jpg', 'jpeg', 'gif', 'svg'];
const ACCEPT_EXT = [...IMAGE_EXT, 'md'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB — mirrors the API limit

type FileFormProps = {
  onSubmit: (data: {
    filename: string;
    slug: string | null;
    dataBase64: string;
  }) => Promise<void>;
  submitLabel: string;
};

function extOf(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() ?? '';
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // strip the `data:<mime>;base64,` prefix
      resolve(result.slice(result.indexOf(',') + 1));
    };
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function FileForm({onSubmit, submitLabel}: FileFormProps) {
  const formId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const slugManuallyEdited = useRef(false);
  const [file, setFile] = useState<File | null>(null);
  const [slug, setSlug] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const slugId = `${formId}-slug`;

  // Revoke the object URL when the preview changes or the form unmounts.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const acceptFile = useCallback((picked: File) => {
    const ext = extOf(picked.name);
    if (!ACCEPT_EXT.includes(ext)) {
      setError(`Unsupported file type ".${ext}". Allowed: ${ACCEPT_EXT.join(', ')}.`);
      return;
    }
    if (picked.size === 0) {
      setError('File is empty.');
      return;
    }
    if (picked.size > MAX_FILE_SIZE_BYTES) {
      setError('File is larger than 10 MB.');
      return;
    }

    setError(null);
    setFile(picked);
    if (!slugManuallyEdited.current) {
      setSlug(slugFromFilename(picked.name));
    }
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return IMAGE_EXT.includes(ext) ? URL.createObjectURL(picked) : null;
    });
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLElement>) => {
      e.preventDefault();
      setDragOver(false);
      const dropped = e.dataTransfer.files?.[0];
      if (dropped) acceptFile(dropped);
    },
    [acceptFile],
  );

  const handleSlugChange = useCallback((value: string) => {
    slugManuallyEdited.current = true;
    setSlug(value);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!file) {
      setError('Choose a file to upload.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const dataBase64 = await readFileAsBase64(file);
      await onSubmit({filename: file.name, slug: slug.trim() || null, dataBase64});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setSubmitting(false);
    }
  }, [file, slug, onSubmit]);

  const inputClass =
    'w-full rounded-md border border-warm-200 bg-white px-3 py-2 text-sm text-warm-800 placeholder:text-warm-400 focus:border-warm-400 focus:outline-none focus:ring-1 focus:ring-warm-400';
  const labelClass = 'block text-sm font-medium text-warm-700 mb-1';

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors ${
          dragOver ? 'border-warm-400 bg-warm-100' : 'border-warm-200 bg-warm-50'
        }`}
      >
        {preview ? (
          <img src={preview} alt="preview" className="max-h-40 max-w-full rounded" />
        ) : file ? (
          <span className="text-sm font-medium text-warm-800">{file.name}</span>
        ) : (
          <>
            <span className="text-sm font-medium text-warm-700">
              Drop a file here, or click to choose
            </span>
            <span className="mt-1 text-xs text-warm-500">
              Images (png, jpg, gif, svg) or markdown (md) · max 10 MB
            </span>
          </>
        )}
        {file && (
          <span className="mt-2 text-xs text-warm-500">
            {file.name} · {(file.size / 1024).toFixed(0)} KB
          </span>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.gif,.svg,.md"
        className="hidden"
        onChange={(e) => {
          const picked = e.target.files?.[0];
          if (picked) acceptFile(picked);
          e.target.value = '';
        }}
      />

      <div>
        <label htmlFor={slugId} className={labelClass}>
          Slug
        </label>
        <input
          id={slugId}
          type="text"
          value={slug}
          onChange={(e) => handleSlugChange(e.target.value)}
          placeholder="defaults to the file name"
          className={inputClass}
        />
        <p className="mt-1 text-xs text-warm-500">
          Will be served at <span className="font-mono">/files/{slug || '…'}</span>
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button onClick={handleSubmit} disabled={submitting || !file}>
        {submitting ? 'Uploading…' : submitLabel}
      </Button>
    </div>
  );
}
