type TagListProps = {
  tags: string[];
};

export function TagList({tags}: TagListProps) {
  return (
    <div className="flex gap-2">
      {tags.map((tag) => (
        <span key={tag} className="rounded-full bg-warm-100 px-2.5 py-0.5 text-xs text-warm-600">
          {tag}
        </span>
      ))}
    </div>
  );
}
