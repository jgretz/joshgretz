import type {MetaFunction} from '@remix-run/node';
import ContentBlock from '@www/components/content-block';
import Page from '@www/components/page';
import {title} from '@www/config.shared';

export const meta: MetaFunction = () => {
  return [{title: title()}, {name: 'description', content: 'Josh Gretz'}];
};

export default function Index() {
  return (
    <Page>
      <ContentBlock>
        I'm a husband, father, maker, developer, runner, cook, baker, nerd, geek, and fan of nearly
        every sport invented.
      </ContentBlock>

      <ContentBlock>
        I believe that being a polymath is a wonderful way to approach life.
      </ContentBlock>

      <ContentBlock>
        I am driven to see genius be realized. I am inspired by crafting a better reality through
        the fusion of ideas, collaboration, and hard work. I have strong opinions, yet try to hold
        them loosely, and strive to express them humbly. I desire to continually improve.
      </ContentBlock>

      <ContentBlock>
        I believe that the best software is built by people for people. I see software development
        as an artistic endeavor rooted in engineering sensibility. I hold that code can be an
        artistic medium.
      </ContentBlock>

      <ContentBlock>This site is a reflection of all of these thoughts and more ...</ContentBlock>
    </Page>
  );
}
