import Page from '~/components/page.tsx';
import About from './components/about.tsx';
import Education from './components/education.tsx';
import Experience from './components/experience.tsx';

export default function Resume() {
  return (
    <Page>
      <About />
      <Experience />
      <Education />
    </Page>
  );
}
