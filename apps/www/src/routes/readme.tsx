import {Link, createFileRoute} from '@tanstack/react-router';
import {type PropsWithChildren} from 'react';
import {PageWrapper} from '../components/layout/page-wrapper';
import {title} from '../config.shared';

export const Route = createFileRoute('/readme')({
  head: () => ({
    meta: [
      {title: title('README')},
      {name: 'description', content: 'Working With Josh Gretz - A personal README'},
    ],
  }),
  component: ReadmePage,
});

const books = [
  {
    title: 'Deep Work',
    author: 'Newport',
    href: 'https://www.amazon.com/Deep-Work-Focused-Success-Distracted/dp/1455586692',
  },
  {
    title: 'The Pragmatic Programmer',
    author: 'Hunt & Thomas',
    href: 'https://www.amazon.com/Pragmatic-Programmer-journey-mastery-Anniversary-dp-0135957052/dp/0135957052',
  },
  {
    title: 'The Essence of Software',
    author: 'Jackson',
    href: 'https://www.amazon.com/Essence-Software-Concepts-Matter-Design/dp/0691225389',
  },
  {
    title: 'Zen and the Art of Motorcycle Maintenance',
    author: 'Pirsig',
    href: 'https://www.amazon.com/Zen-Art-Motorcycle-Maintenance-Inquiry/dp/0061673730',
  },
  {
    title: 'Atomic Habits',
    author: 'Clear',
    href: 'https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299',
  },
  {
    title: 'Good to Great',
    author: 'Collins',
    href: 'https://www.amazon.com/Good-Great-Some-Companies-Others/dp/0066620996',
  },
  {
    title: 'Crucial Conversations',
    author: 'Grenny & Switzler',
    href: 'https://www.amazon.com/Crucial-Conversations-Talking-Stakes-Second/dp/0071771328',
  },
  {
    title: 'The Goal',
    author: 'Goldratt',
    href: 'https://www.amazon.com/Goal-Process-Ongoing-Improvement/dp/0884271951',
  },
  {
    title: 'Sondheim, Seurat, Software: Finding Art in Code',
    author: 'Jon Skeet',
    href: 'https://www.youtube.com/watch?v=FsPkHGt1p2c',
    video: true,
  },
  {
    title: 'Inventing on Principle',
    author: 'Bret Victor',
    href: 'https://www.youtube.com/watch?v=EGqwXt90ZqA',
    video: true,
  },
  {
    title: 'We Are The Art',
    author: 'Brandon Sanderson',
    href: 'https://www.youtube.com/watch?v=mb3uK-_QkOo',
    video: true,
  },
  {
    title: 'Propositions As Types',
    author: 'Philip Wadler',
    href: 'https://homepages.inf.ed.ac.uk/wadler/papers/propositions-as-types/propositions-as-types.pdf',
  },
  {
    title: 'The Cathedral and the Bazaar',
    author: 'Eric S. Raymond',
    href: 'https://www.catb.org/~esr/writings/cathedral-bazaar/cathedral-bazaar/',
  },
] as const;

const cliftonStrengths = [
  'Input',
  'Strategic',
  'Command',
  'Learner',
  'Analytical',
  'Responsibility',
  'Ideation',
  'Achiever',
  'Self-Assurance',
  'Competition',
];

function ReadmePage() {
  return (
    <PageWrapper className="max-w-[720px]">
      {/* Hero */}
      <header className="mb-12 text-center">
        <h1 className="font-serif text-4xl font-normal text-warm-800">Working With Josh Gretz</h1>
        <p className="mt-3 font-hand text-xl italic text-warm-600">
          Husband, father, developer, cook, baker, nerd, geek.
        </p>
      </header>

      {/* Intro Quote */}
      <div className="mb-12 rounded-xl border-l-[3px] border-warm-600 bg-white/50 px-8 py-6">
        <Prose>
          I believe highly functioning software teams make the world better. I&apos;m a builder - of
          software, of teams, of organizations.
        </Prose>
      </div>

      {/* My Philosophy */}
      <Section title="My Philosophy">
        <Belief>
          <strong>I&apos;m driven to see genius realized</strong> through the fusion of ideas,
          collaboration, and hard work.
        </Belief>
        <Belief>
          <strong>I believe the best software is built by people for people</strong> - an artistic
          endeavor rooted in engineering sensibility. Code can be an artistic medium. The knowledge
          the team holds is the true value; the code is the easy part.
        </Belief>
        <Belief>
          <strong>The magic happens</strong> when software makes a formerly difficult or tedious
          task disappear, surfaces that critical bit of data at the right moment, or maps the real
          world to the user&apos;s journey in a way that just <em>works</em>. That&apos;s what
          software is - not the loops, object, buttons, or text boxes.
        </Belief>
        <Belief>
          <strong>I believe in Conway&apos;s Law:</strong> software will evolve to match the team
          that creates it. This is why people matter so much. You can&apos;t separate product
          quality from team quality. Fix the team, and the software follows.
        </Belief>
        <Belief>
          <strong>I hold strong opinions, loosely.</strong> I&apos;ll push hard on ideas I believe
          in, but I keep an open mind and I&apos;m persuadable. I strive to express my views humbly,
          and I expect the same direct engagement in return.
        </Belief>
        <Belief>
          <strong>My goal is always to build capability, not dependency.</strong> Success isn&apos;t
          measured by how indispensable I become - it&apos;s measured by how strong, confident, and
          capable the team is when we&apos;re done. The goal is always developing people and the
          environment they work in so that at the end of our time together, the team is hitting
          their stride and doesn&apos;t need me anymore.
        </Belief>
      </Section>

      {/* How I Work */}
      <Section title="How I Work">
        <Subsection title="Context Shapes Intensity" />
        <Prose>My approach shifts depending on where we are in the journey.</Prose>
        <Prose>
          <strong>Early on</strong>, when we&apos;re building the foundation and standing up the
          team, I take a stronger hand in driving progress. There&apos;s no existing muscle yet -
          decisions need to be made, direction needs to be set. Expect me to be more directive.
        </Prose>
        <Prose>
          <strong>As the team matures</strong>, I deliberately step back into coaching. The goal
          shifts from <em>me</em> driving progress to <em>them</em> developing the capacity to drive
          it themselves. I&apos;ll push for them to figure it out, but I&apos;m always the backstop
          for the team and the company. I coach people to accomplish things while keeping who{' '}
          <em>they</em> are as the guiding light for <em>how</em> they do it. I&apos;m not trying to
          create mini-Joshes - I&apos;m trying to unlock your version of strong.
        </Prose>

        <Subsection title="Communication" />
        <Prose>
          I value protecting focus time - mine and yours. This drives a lot of my thinking around
          communication.
        </Prose>
        <Prose>
          <strong>I match medium to message type:</strong>
        </Prose>

        <div className="mb-6 overflow-x-auto">
          <table className="w-full font-sans text-sm text-warm-700">
            <thead>
              <tr className="border-b-2 border-warm-400">
                <th className="pb-2 pr-4 text-left font-semibold text-warm-700">Type</th>
                <th className="pb-2 pr-4 text-left font-semibold text-warm-700">Medium</th>
                <th className="pb-2 text-left font-semibold text-warm-700">Why</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-warm-400/30">
                <td className="py-2 pr-4">Information sharing, updates</td>
                <td className="py-2 pr-4">Slack async (primary), email (secondary)</td>
                <td className="py-2">Doesn&apos;t interrupt flow</td>
              </tr>
              <tr className="border-b border-warm-400/30">
                <td className="py-2 pr-4">Decision making</td>
                <td className="py-2 pr-4">Slack sync</td>
                <td className="py-2">Often evolves naturally from info sharing</td>
              </tr>
              <tr className="border-b border-warm-400/30">
                <td className="py-2 pr-4">Collaboration</td>
                <td className="py-2 pr-4">
                  Video call when text hits ~20+ messages or complexity exceeds what text handles
                  well
                </td>
                <td className="py-2">Real-time is faster past a threshold</td>
              </tr>
              <tr className="border-b border-warm-400/30">
                <td className="py-2 pr-4">Ideation</td>
                <td className="py-2 pr-4">Video + visual tools (Miro, etc.) or in-person</td>
                <td className="py-2">Needs a larger pipe</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Conflict resolution</td>
                <td className="py-2 pr-4">Video/audio required</td>
                <td className="py-2">Non-verbals matter; you can&apos;t replace them in text</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Prose>
          Once decisions are made in real-time conversation, they should always be captured in Slack
          and/or a knowledge base (Notion, Confluence, etc.).
        </Prose>

        <Subsection title="Meetings" />
        <BulletList>
          <li>
            <strong>Camera on, muted until speaking</strong> - that&apos;s my default
          </li>
          <li>
            <strong>Agendas and purpose required</strong> - I value the time of the people on my
            teams
          </li>
          <li>
            <strong>Fewer routine reporting meetings</strong> - use Slack for basic standups; invest
            meeting time in high-bandwidth work like demos, ideation, and collaboration
          </li>
          <li>
            <strong>I&apos;m a storyteller</strong> - I&apos;ll admit to sometimes being the cause
            of a meeting going off course. Feel free to &ldquo;smack&rdquo; me back on track. But
            there&apos;s also value, especially in virtual environments, in spending some time on
            the personal and relational. Identifying the constraints of the meeting upfront helps.
          </li>
        </BulletList>

        <Subsection title="Calendar" />
        <BulletList>
          <li>
            <strong>My calendar is gospel</strong> - given the reality of my work across multiple
            contexts, I invest in tooling to ensure my calendar accurately shows my availability.
            You can trust what you see.
          </li>
          <li>
            <strong>Punctuality is respect</strong> - things happen, and I&apos;ll always
            communicate if something needs to change last minute. I expect the same.
          </li>
        </BulletList>

        <Subsection title="Responsiveness" />
        <Prose>
          I try to be responsive on Slack (then email) and never want to be the blocker. If
          there&apos;s a reason I can&apos;t be responsive for a time frame, you&apos;ll know about
          it beforehand.
        </Prose>
        <Prose>
          My default communication style is train of thought - direct and unpolished unless the
          situation requires something more deliberate (which is rare for day-to-day work).
        </Prose>
      </Section>

      {/* 1:1s */}
      <Section title="1:1s">
        <Prose>
          <strong>1:1s are primarily for you, not me.</strong> It&apos;s your time and space to get
          what you need, express your thoughts and opinions. It&apos;s not a status report -
          it&apos;s a true check-in on how you&apos;re doing, what&apos;s occupying your thoughts,
          and what you need to be happy and effective.
        </Prose>
        <Prose>
          1:1s naturally vary by person and situation. Sometimes they&apos;re career-oriented,
          sometimes about immediate tasks, and sometimes they&apos;re a therapy couch. All are okay.
          The key is that at the end of each conversation, you&apos;re a little further down the
          path to your ideal.
        </Prose>
      </Section>

      {/* What I Value */}
      <Section title="What I Value">
        <Prose>
          <strong>Direct, transparent communication</strong> - say what you mean
        </Prose>
        <Prose>
          <strong>Addressing problems early</strong> - confronting concerns head-on prevents them
          from becoming larger issues
        </Prose>
        <Prose>
          <strong>Curiosity and understanding</strong> - seek to understand a problem before asking
          others for help. At the same time, know when to stop spinning and ask - there&apos;s value
          in talking to the duck (or a human)
        </Prose>
        <Prose>
          <strong>Understanding over generation</strong> - code generation tools can be a great
          help, but you can never give up the necessity of understanding the problem and the
          solution. You can&apos;t outsource comprehension.
        </Prose>
        <Prose>
          <strong>Craftsmanship</strong> - I appreciate code that works, is elegant, consistent, and
          maintainable
        </Prose>
        <Prose>
          <strong>Doing the right thing</strong> - I appreciate people who care about those around
          them enough to do the right thing regardless of the immediate cost
        </Prose>
        <Prose>
          <strong>Ownership</strong> - if there&apos;s a problem, it&apos;s everyone&apos;s problem
          until it&apos;s solved. Origin doesn&apos;t matter; solving it does.
        </Prose>
      </Section>

      {/* What to Know About Me */}
      <Section title="What to Know About Me">
        <Subsection title="Energy Sources" />
        <BulletList>
          <li>Creating</li>
          <li>Solving hard problems</li>
          <li>Learning</li>
        </BulletList>

        <Subsection title="Energy Drains" />
        <BulletList>
          <li>Repetitive busy work</li>
          <li>Justifying the obvious</li>
        </BulletList>

        <Subsection title="Growth Edges" />
        <Prose>
          <strong>Celebrating.</strong> I&apos;m naturally wired to solve a problem and then move to
          the next one. I don&apos;t spend a lot of time celebrating wins. I try to step back and do
          this more often, but it&apos;s still a growth edge. Don&apos;t interpret me moving on as
          not caring - and feel free to prompt me (&ldquo;Hey, can we take a minute on
          this?&rdquo;).
        </Prose>
        <Prose>
          <strong>Patience with what feels obvious.</strong> What&apos;s self-evident to me may not
          be to others. I&apos;m aware of this and work on it.
        </Prose>

        <Subsection title="Personal Context" />
        <Prose>
          <strong>I have ADHD and OCD.</strong> I&apos;ve learned to use them as a bit of a
          superpower, but they show up in ways you might notice - grammar pedantry, punctuality
          about reservations, intensity of focus. Naming this helps explain behaviors that might
          otherwise seem arbitrary.
        </Prose>
        <Prose>
          <strong>I&apos;m an ultra runner</strong> (
          <Link to="/running" className="text-warm-600 underline hover:text-warm-800">
            joshgretz.com/running
          </Link>
          ). I&apos;m committed to doing the hard thing regardless of how hard. I may get knocked
          down, but I will always keep going.
        </Prose>
        <Prose>
          <strong>I love to cook and bake</strong> - it&apos;s how I unwind and another expression
          of the same creative/maker/builder wiring that drives my work.
        </Prose>

        <Subsection title="Work Hours" />
        <BulletList>
          <li>Generally 9-6 EST, but rarely fully &ldquo;off&rdquo; from communication</li>
          <li>I weave personal and work lives so both get my best - not rigid separation</li>
          <li>I communicate proactively when conflicts arise and expect the same</li>
          <li>I expect you to care for yourself, be flexible, and communicate openly</li>
        </BulletList>
      </Section>

      {/* Feedback & Accountability */}
      <Section title="Feedback & Accountability">
        <Prose>
          <strong>Call me on my BS.</strong> I want anyone to feel free to do this at any point. I
          commit to listening, seeking to understand, and having an open and honest conversation. We
          might not always agree, but we will always hear each other.
        </Prose>
        <Prose>
          <strong>Intentions don&apos;t override consequences.</strong> I realize intention and
          action don&apos;t always equal each other, but consequences are the truth regardless of
          intention. Good intentions are not a get-out-of-jail-free card - everyone needs to own the
          results of their actions.
        </Prose>
        <Prose>
          <strong>No time machines.</strong> When something has gone wrong, we should acknowledge
          it, learn what we can, and move onto solving the reality we face. That doesn&apos;t mean
          downplaying emotional and relational effects - those are part of the reality we need to
          address going forward.
        </Prose>
        <Prose>
          <strong>Restitution matters.</strong> An apology without restitution is just words. Making
          it right is part of making it right.
        </Prose>
      </Section>

      {/* Books & Ideas */}
      <Section title="Books & Ideas That Shape My Thinking">
        <div className="space-y-3">
          {books.map((book) => (
            <BookLink key={book.title} {...book} />
          ))}
        </div>
      </Section>

      {/* Assessments */}
      <Section title="Assessments">
        <Subsection title="DISC: D-Style" />
        <Prose>
          I&apos;m strongly D-style - direct, results-oriented, takes charge. My intensity varies by
          context: more directive when building foundations, more coaching-oriented as teams mature.
        </Prose>

        <Subsection title="CliftonStrengths Top 10" />
        <ol className="mb-4 list-decimal pl-6 font-serif text-[0.95rem] leading-[1.8] text-warm-700">
          {cliftonStrengths.map((strength) => (
            <li key={strength} className="text-warm-700">
              {strength}
            </li>
          ))}
        </ol>
        <Prose>
          I lead with <strong>Strategic Thinking</strong> - I absorb and analyze information to
          inform better decisions.
        </Prose>

        <Subsection title="Enneagram: Type 8 (The Challenger)" />
        <Prose>
          Protective, direct, ownership-oriented. I see myself as strong and capable, stand up for
          what I believe in, and fight for those I care about.
        </Prose>
      </Section>

      {/* Closing */}
      <footer className="mt-16 text-center">
        <p className="font-hand text-xl italic text-warm-600">
          Strong opinions, loosely held, humbly expressed.
        </p>
      </footer>
    </PageWrapper>
  );
}

// --- Local sub-components ---

const Section = ({title, children}: PropsWithChildren<{title: string}>) => (
  <section className="mb-12">
    <h2 className="mb-6 border-b-2 border-warm-400 pb-2 font-serif text-2xl font-normal text-warm-800">
      {title}
    </h2>
    {children}
  </section>
);

const Subsection = ({title}: {title: string}) => (
  <h3 className="mb-3 mt-6 font-sans text-sm font-semibold uppercase tracking-wide text-warm-700">
    {title}
  </h3>
);

const Prose = ({children}: PropsWithChildren) => (
  <p className="mb-4 font-serif text-[0.95rem] leading-[1.8] text-warm-700">{children}</p>
);

const Belief = ({children}: PropsWithChildren) => (
  <p className="mb-5 border-l-2 border-warm-600/30 pl-4 font-serif text-[0.95rem] leading-[1.8] text-warm-700">
    {children}
  </p>
);

const BulletList = ({children}: PropsWithChildren) => (
  <ul className="mb-6 list-none space-y-2 pl-0">
    {Array.isArray(children) ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: acceptable here since list is static and generic
      children.map((child, i) => <BulletItem key={`item-${i}`}>{child}</BulletItem>)
    ) : (
      <BulletItem>{children}</BulletItem>
    )}
  </ul>
);

const BulletItem = ({children}: PropsWithChildren) => (
  <li className="relative pl-4 font-sans text-[0.95rem] leading-[1.8] text-warm-700">
    <span className="absolute left-0 text-warm-600">•</span>
    {children}
  </li>
);

const BookLink = ({
  title,
  author,
  href,
  video,
}: {
  title: string;
  author: string;
  href: string;
  video?: boolean;
}) => (
  <div className="flex items-baseline gap-2 font-sans text-[0.95rem]">
    <span className="text-warm-600">→</span>
    <div>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="font-semibold text-warm-700 hover:text-warm-600"
      >
        {title}
      </a>
      <span className="text-warm-500"> - {author}</span>
      {video && (
        <span className="ml-2 rounded bg-warm-600/15 px-1.5 py-0.5 text-[0.7rem] text-warm-600">
          video
        </span>
      )}
    </div>
  </div>
);
