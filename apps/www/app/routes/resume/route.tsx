import Page from '@www/components/page';
import About from './components/about';
import Education from './components/education';
import Experience from './components/experience';

export default function Resume() {
  return (
    <Page>
      <About />
      <Experience />
      <Education />
    </Page>
  );
}
