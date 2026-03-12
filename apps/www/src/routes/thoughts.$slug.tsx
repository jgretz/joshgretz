import {createFileRoute, notFound} from '@tanstack/react-router';
import {format} from 'date-fns';
import {TagList} from '../components/thoughts/tag-list';
import {ThoughtContent} from '../components/thoughts/thought-content';
import {title} from '../config.shared';
import type {Thought} from '../services/thoughts/thoughts-server';
import {getThoughtBySlug} from '../services/thoughts/thoughts-server';

type ThoughtLoaderData = {
  thought: Thought;
};

export const Route = createFileRoute('/thoughts/$slug')({
  component: ThoughtDetailPage,
  head: ({loaderData}: {loaderData?: ThoughtLoaderData}) => {
    if (!loaderData) return {};
    return {
      meta: [
        {title: title(loaderData.thought.title)},
        {property: 'og:title', content: loaderData.thought.title},
        {property: 'og:type', content: 'article'},
      ],
    };
  },
  loader: async ({params}): Promise<ThoughtLoaderData> => {
    const thought = await getThoughtBySlug({data: {slug: params.slug}});
    if (!thought) throw notFound();
    return {thought};
  },
});

function ThoughtDetailPage() {
  const {thought} = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="font-serif text-4xl text-warm-800">{thought.title}</h1>
      {thought.published_at && (
        <time className="mt-2 block text-sm text-warm-500">
          {format(new Date(thought.published_at), 'MMMM d, yyyy')}
        </time>
      )}
      {thought.tags && thought.tags.length > 0 && (
        <div className="mt-3">
          <TagList tags={thought.tags} />
        </div>
      )}
      <div className="mt-8">
        <ThoughtContent content={thought.content} />
      </div>
    </div>
  );
}
