import {Link} from '@tanstack/react-router';
import {format} from 'date-fns';
import {TagList} from './tag-list';

type ThoughtCardProps = {
  title: string;
  slug: string;
  description: string | null;
  tags: string[] | null;
  published_at: string;
};

export function ThoughtCard({title, slug, description, tags, published_at}: ThoughtCardProps) {
  return (
    <Link
      to="/thoughts/$slug"
      params={{slug}}
      className="block rounded-lg border border-warm-200 bg-white p-6 transition-colors hover:border-warm-400"
    >
      <h2 className="font-serif text-xl text-warm-800">{title}</h2>
      <time className="mt-1 text-sm text-warm-500">
        {format(new Date(published_at), 'MMMM d, yyyy')}
      </time>
      {description && <p className="mt-2 text-warm-600">{description}</p>}
      {tags && tags.length > 0 && (
        <div className="mt-3">
          <TagList tags={tags} />
        </div>
      )}
    </Link>
  );
}
