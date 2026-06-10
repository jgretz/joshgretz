// Slugify arbitrary text: lowercase, strip punctuation, collapse whitespace to dashes.
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Derive a default slug from a filename by stripping its extension first.
export function slugFromFilename(filename: string): string {
  return toSlug(filename.replace(/\.[^./\\]+$/, ''));
}
