import Page from '~/components/page';
import Education from './education';
import Experience from './experience';
import About from './about';

export default function Resume() {
  return (
    <Page>
      <About />
      <Experience />
      <Education />
    </Page>
  );
}
