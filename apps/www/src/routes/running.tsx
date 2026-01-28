import {createFileRoute} from '@tanstack/react-router';
import {PageWrapper} from '../components/layout/page-wrapper';
import {SectionHeader} from '../components/ui/section-header';
import {title} from '../config.shared';

export const Route = createFileRoute('/running')({
  head: () => ({
    meta: [{title: title('Running')}, {name: 'description', content: 'Josh Gretz - Running'}],
  }),
  component: Running,
});

function Running() {
  return (
    <PageWrapper maxWidth="4xl">
      <SectionHeader>Running</SectionHeader>
      <p className="font-sans text-lg leading-relaxed text-warm-700">Running data coming soon...</p>
    </PageWrapper>
  );
}
