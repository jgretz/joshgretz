import {createFileRoute} from '@tanstack/react-router';
import {ThoughtCard} from '../components/thoughts/thought-card';
import {title} from '../config.shared';
import {getPublishedThoughts} from '../services/thoughts/thoughts-server';

export const Route = createFileRoute('/thoughts/')({
  component: ThoughtsPage,
  head: () => ({
    meta: [
      {title: title('Thoughts')},
      {name: 'description', content: 'Thoughts and writings by Josh Gretz'},
    ],
  }),
  loader: async () => {
    const thoughts = await getPublishedThoughts();
    return {thoughts};
  },
});

function ThoughtsPage() {
  const {thoughts} = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="mb-8 font-serif text-4xl text-warm-800">Thoughts</h1>
      {thoughts.length === 0 ? (
        <p className="text-warm-600">Nothing here yet.</p>
      ) : (
        <div className="space-y-6">
          {thoughts.map((thought) => (
            <ThoughtCard
              key={thought.id}
              title={thought.title}
              slug={thought.slug}
              tags={thought.tags}
              published_at={thought.published_at}
            />
          ))}
        </div>
      )}
    </div>
  );
}
