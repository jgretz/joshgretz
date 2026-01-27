import { createFileRoute } from '@tanstack/react-router';
import Page from '../components/page';
import About from '../components/resume/about';
import Education from '../components/resume/education';
import Experience from '../components/resume/experience';
import Skills from '../components/resume/skills';
import { title } from '../config.shared';

export const Route = createFileRoute('/resume')({
  head: () => ({
    meta: [
      { title: title('Resume') },
      { name: 'description', content: 'Josh Gretz - Resume' },
    ],
  }),
  component: Resume,
});

function Resume() {
  return (
    <Page>
      <About />
      <Experience />
      <Education />
      <Skills />
    </Page>
  );
}
