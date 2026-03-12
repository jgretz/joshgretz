import {marked} from 'marked';

marked.use({async: false});
import {type FormEvent, useCallback, useRef, useState} from 'react';
import {Button} from '../ui/button';

type ThoughtFormProps = {
  initialData?: {
    title: string;
    slug: string;
    content: string;
    description: string;
    tags: string;
    published_at: string;
  };
  onSubmit: (data: {
    title: string;
    slug: string;
    content: string;
    description: string | null;
    tags: string[] | null;
    published_at: string | null;
  }) => Promise<void>;
  submitLabel: string;
};

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function ThoughtForm({initialData, onSubmit, submitLabel}: ThoughtFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [slug, setSlug] = useState(initialData?.slug ?? '');
  const [content, setContent] = useState(initialData?.content ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [tags, setTags] = useState(initialData?.tags ?? '');
  const [publishedAt, setPublishedAt] = useState(initialData?.published_at ?? '');
  const [preview, setPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const slugManuallyEdited = useRef(!!initialData);

  const handleTitleChange = useCallback((value: string) => {
    setTitle(value);
    if (!slugManuallyEdited.current) {
      setSlug(toSlug(value));
    }
  }, []);

  const handleSlugChange = useCallback((value: string) => {
    slugManuallyEdited.current = true;
    setSlug(value);
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      try {
        const parsedTags = tags.trim()
          ? tags
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : null;
        await onSubmit({
          title,
          slug,
          content,
          description: description || null,
          tags: parsedTags,
          published_at: publishedAt || null,
        });
      } finally {
        setSubmitting(false);
      }
    },
    [title, slug, content, description, tags, publishedAt, onSubmit],
  );

  const inputClass =
    'w-full rounded-md border border-warm-200 bg-white px-3 py-2 text-sm text-warm-800 placeholder:text-warm-400 focus:border-warm-400 focus:outline-none focus:ring-1 focus:ring-warm-400';
  const labelClass = 'block text-sm font-medium text-warm-700 mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className={inputClass}
          required
        />
      </div>

      <div>
        <label className={labelClass}>Slug</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => handleSlugChange(e.target.value)}
          className={inputClass}
          required
        />
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className={labelClass}>Content</label>
          <button
            type="button"
            onClick={() => setPreview((p) => !p)}
            className="text-xs text-warm-600 hover:text-warm-800"
          >
            {preview ? 'Edit' : 'Preview'}
          </button>
        </div>
        {preview ? (
          <div
            className="prose prose-warm min-h-[200px] rounded-md border border-warm-200 bg-warm-50 p-3"
            dangerouslySetInnerHTML={{__html: marked.parse(content) as string}}
          />
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`${inputClass} min-h-[200px]`}
            required
          />
        )}
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${inputClass} min-h-[80px]`}
        />
      </div>

      <div>
        <label className={labelClass}>Tags (comma-separated)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className={inputClass}
          placeholder="react, typescript, thoughts"
        />
      </div>

      <div>
        <label className={labelClass}>Published At (leave empty for draft)</label>
        <input
          type="datetime-local"
          value={publishedAt}
          onChange={(e) => setPublishedAt(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
