import {marked} from 'marked';

type ThoughtContentProps = {
  content: string;
};

export function ThoughtContent({content}: ThoughtContentProps) {
  const html = marked(content) as string;

  return <div className="prose prose-warm max-w-none" dangerouslySetInnerHTML={{__html: html}} />;
}
