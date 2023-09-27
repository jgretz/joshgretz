import type {V2_MetaFunction} from '@remix-run/node';
import type {ReactNode} from 'react';

export const meta: V2_MetaFunction = () => {
  return [{title: 'Josh Gretz'}, {name: 'description', content: ''}];
};

interface ContentBlockProps {
  children: ReactNode;
}

function ContentBlock({children}: ContentBlockProps) {
  return <div className="my-2">{children}</div>;
}

export default function Index() {
  return (
    <div className="p-5 h-full w-full max-w-7xl sm:flex sm:flex-col sm:justify-center">
      <ContentBlock>
        I'm a husband, father, maker, developer, runner, cook, baker, nerd, geek, and fan of nearly
        every sport invented.
      </ContentBlock>

      <ContentBlock>
        I believe that being a polymath is a wonderful way to approach life. I love drinking from
        the firehose on a daily basis.
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

      <ContentBlock>
        This site is an attempt to be a reflection of all of these thoughts and more ...
      </ContentBlock>
    </div>
  );
}
