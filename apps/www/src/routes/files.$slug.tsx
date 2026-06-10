import {createFileRoute, notFound} from '@tanstack/react-router';
import {ThoughtContent} from '../components/thoughts/thought-content';
import {title} from '../config.shared';
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

  if (file.kind === 'image') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-warm-50 p-6">
        <img
          src={`/files/${file.slug}/raw`}
          alt={file.original_filename}
          className="max-h-full max-w-full"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <ThoughtContent content={file.content ?? ''} />
    </div>
  );
}
