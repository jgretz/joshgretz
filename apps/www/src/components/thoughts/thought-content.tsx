import {marked} from 'marked';

type ThoughtContentProps = {
  content: string;
};

export function ThoughtContent({content}: ThoughtContentProps) {
  const html = marked(content) as string;

  // biome-ignore lint/security/noDangerouslySetInnerHtml: rendering parsed markdown
  return <div className="prose prose-warm max-w-none" dangerouslySetInnerHTML={{__html: html}} />;
}
