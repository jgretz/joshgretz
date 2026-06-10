import type {Database} from 'database';

export interface FilesConfig {
  databaseUrl: string;
}

export interface FilesContainer {
  database: Database;
}

export type FileKind = 'image' | 'markdown';

export type FileRecord = {
  id: number;
  slug: string;
  original_filename: string;
  mime_type: string;
  size_bytes: number;
  data: Buffer;
  created_at: string | null;
  updated_at: string | null;
};

export type FileMetadata = Omit<FileRecord, 'data'>;

export type CreateFileInput = {
  original_filename: string;
  slug?: string | null;
  data: Buffer;
};

export type UpdateFileSlugInput = {
  slug: string;
};

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

type AllowedType = {extensions: string[]; mime: string; kind: FileKind};

// Single source of truth for the upload allowlist. Re-checked at the API boundary.
export const ALLOWED_TYPES: AllowedType[] = [
  {extensions: ['png'], mime: 'image/png', kind: 'image'},
  {extensions: ['jpg', 'jpeg'], mime: 'image/jpeg', kind: 'image'},
  {extensions: ['gif'], mime: 'image/gif', kind: 'image'},
  {extensions: ['svg'], mime: 'image/svg+xml', kind: 'image'},
  {extensions: ['md'], mime: 'text/markdown', kind: 'markdown'},
];

// Resolve the canonical mime/kind from the filename extension (authoritative —
// we never trust a client-supplied mime, which could be spoofed).
export function resolveType(filename: string): {mime: string; kind: FileKind} | undefined {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  const match = ALLOWED_TYPES.find((t) => t.extensions.includes(ext));
  return match ? {mime: match.mime, kind: match.kind} : undefined;
}

export function kindForMime(mime: string): FileKind {
  return mime.startsWith('image/') ? 'image' : 'markdown';
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function slugFromFilename(filename: string): string {
  const withoutExt = filename.replace(/\.[^./\\]+$/, '');
  return toSlug(withoutExt);
}

// Throws on an unsupported type, an oversized file, or an empty file.
// Returns the resolved mime/kind on success.
export function validateUpload(
  filename: string,
  sizeBytes: number,
): {mime: string; kind: FileKind} {
  const type = resolveType(filename);
  if (!type) {
    throw new Error(`Unsupported file type: ${filename}`);
  }
  if (sizeBytes === 0) {
    throw new Error('File is empty');
  }
  if (sizeBytes > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File too large: ${sizeBytes} bytes (max ${MAX_FILE_SIZE_BYTES})`);
  }
  return type;
}

export function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as {code?: string}).code === '23505'
  );
}
