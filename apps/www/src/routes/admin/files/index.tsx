import {createFileRoute, useRouter} from '@tanstack/react-router';
import {useCallback, useState} from 'react';
import {FileForm} from '../../../components/admin/file-form';
import {AdminLayout} from '../../../components/layout/admin-layout';
import {Button} from '../../../components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import {title} from '../../../config.shared';
import {requireAuth} from '../../../services/auth/requireAuth';
import {
  type FileListItem,
  createFile,
  deleteFile,
  getFiles,
  updateFileSlug,
} from '../../../services/files/files-server';

export const Route = createFileRoute('/admin/files/')({
  component: FilesList,
  beforeLoad: requireAuth,
  head: () => ({
    meta: [{title: title('Files')}],
  }),
  loader: async () => {
    const files = await getFiles();
    return {files};
  },
});

function kindOf(mimeType: string): 'image' | 'markdown' {
  return mimeType.startsWith('image/') ? 'image' : 'markdown';
}

function FilesList() {
  const {files: loaderFiles} = Route.useLoaderData();
  const router = useRouter();
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());
  const [deleting, setDeleting] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<FileListItem | null>(null);
  const [editSlug, setEditSlug] = useState('');
  const [savingSlug, setSavingSlug] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const files = loaderFiles.filter((f) => !deletedIds.has(f.id));

  const handleCopy = useCallback(async (file: FileListItem) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/files/${file.slug}`);
      setCopiedId(file.id);
      setTimeout(() => setCopiedId((current) => (current === file.id ? null : current)), 1500);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to copy URL');
    }
  }, []);

  const handleCreate = useCallback(
    async (data: {filename: string; slug: string | null; dataBase64: string}) => {
      await createFile({data});
      setCreateOpen(false);
      router.invalidate();
    },
    [router],
  );

  const openEdit = useCallback((file: FileListItem) => {
    setEditing(file);
    setEditSlug(file.slug);
  }, []);

  const handleSaveSlug = useCallback(async () => {
    if (!editing) return;
    setSavingSlug(true);
    try {
      await updateFileSlug({data: {id: editing.id, slug: editSlug.trim()}});
      setEditing(null);
      router.invalidate();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update slug');
    } finally {
      setSavingSlug(false);
    }
  }, [editing, editSlug, router]);

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm('Delete this file?')) return;
    setDeleting(id);
    try {
      await deleteFile({data: {id}});
      setDeletedIds((prev) => new Set(prev).add(id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setDeleting(null);
    }
  }, []);

  return (
    <AdminLayout title="Files">
      <div className="mb-6">
        <Button onClick={() => setCreateOpen(true)}>Upload File</Button>
      </div>

      {files.length === 0 ? (
        <p className="text-warm-600">No files yet.</p>
      ) : (
        <div className="space-y-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between rounded-lg border border-warm-200 bg-white p-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-medium text-warm-800">{file.original_filename}</h3>
                  <span className="inline-flex items-center rounded-full bg-warm-100 px-2 py-0.5 text-xs font-medium text-warm-600">
                    {kindOf(file.mime_type)}
                  </span>
                </div>
                <a
                  href={`/files/${file.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 block truncate font-mono text-sm text-warm-500 hover:text-warm-700"
                >
                  /files/{file.slug}
                </a>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleCopy(file)}>
                  {copiedId === file.id ? 'Copied!' : 'Copy URL'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => openEdit(file)}>
                  Edit slug
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(file.id)}
                  disabled={deleting === file.id}
                >
                  {deleting === file.id ? 'Deleting…' : 'Delete'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
            <DialogClose className="absolute right-4 top-4 text-warm-400 hover:text-warm-600">
              ✕
            </DialogClose>
          </DialogHeader>
          <FileForm onSubmit={handleCreate} submitLabel="Upload" />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit slug</DialogTitle>
            <DialogClose className="absolute right-4 top-4 text-warm-400 hover:text-warm-600">
              ✕
            </DialogClose>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="text"
              value={editSlug}
              onChange={(e) => setEditSlug(e.target.value)}
              className="w-full rounded-md border border-warm-200 bg-white px-3 py-2 text-sm text-warm-800 focus:border-warm-400 focus:outline-none focus:ring-1 focus:ring-warm-400"
            />
            <Button onClick={handleSaveSlug} disabled={savingSlug || !editSlug.trim()}>
              {savingSlug ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
