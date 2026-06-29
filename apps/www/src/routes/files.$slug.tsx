import {createFileRoute, notFound} from '@tanstack/react-router';
import {ThoughtContent} from '../components/thoughts/thought-content';
import {Button} from '../components/ui/button';
import {title} from '../config.shared';
import {getApiUrl} from '../services/api-client';
import {type FileDetail, getFileBySlug} from '../services/files/files-server';

type FileLoaderData = {
  file: FileDetail;
};

export const Route = createFileRoute('/files/$slug')({
  component: FilePage,
  head: ({loaderData}: {loaderData?: FileLoaderData}) => ({
    meta: [
      {name: 'robots', content: 'noindex'},
      ...(loaderData ? [{title: title(loaderData.file.original_filename)}] : []),
    ],
  }),
  loader: async ({params}): Promise<FileLoaderData> => {
    const file = await getFileBySlug({data: {slug: params.slug}});
    if (!file) throw notFound();
    return {file};
  },
});

function FilePage() {
  const {file} = Route.useLoaderData();
  const downloadUrl = `${getApiUrl()}/files/raw/${file.slug}?download=1`;

  return (
    <>
      <div className="fixed right-4 top-4 z-10">
        <Button asChild variant="outline" size="sm">
          <a href={downloadUrl}>Download</a>
        </Button>
      </div>
      {file.kind === 'image' ? (
        <div className="flex min-h-screen items-center justify-center bg-warm-50 p-6">
          <img
            src={`${getApiUrl()}/files/raw/${file.slug}`}
            alt={file.original_filename}
            className="max-h-full max-w-full"
          />
        </div>
      ) : (
        <div className="mx-auto max-w-2xl px-6 py-24">
          <ThoughtContent content={file.content ?? ''} />
        </div>
      )}
    </>
  );
}
