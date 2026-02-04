import {Link, createFileRoute} from '@tanstack/react-router';
import {type PropsWithChildren} from 'react';
import {match} from 'ts-pattern';
import {PageWrapper} from '../components/layout/page-wrapper';
import {title} from '../config.shared';

type SourceType = 'book' | 'video' | 'paper';

type Source = {
  title: string;
  author: string;
  href: string;
  type: SourceType;
};

export const Route = createFileRoute('/readme')({
  head: () => ({
    meta: [
      {title: title('README')},
      {name: 'description', content: 'The "Short" Version of Me - A personal README'},
    ],
  }),
  component: ReadmePage,
});

const sources: Source[] = [
  {
    title: 'Deep Work',
    author: 'Cal Newport',
    href: 'https://www.amazon.com/Deep-Work-Focused-Success-Distracted/dp/1455586692',
    type: 'book',
  },
  {
    title: 'The Pragmatic Programmer',
    author: 'Andy Hunt, Dave Thomas',
    href: 'https://www.amazon.com/Pragmatic-Programmer-journey-mastery-Anniversary-dp-0135957052/dp/0135957052',
    type: 'book',
  },
  {
    title: 'The Essence of Software',
    author: 'Daniel Jackson',
    href: 'https://www.amazon.com/Essence-Software-Concepts-Matter-Design/dp/0691225389',
    type: 'book',
  },
  {
    title: 'Zen and the Art of Motorcycle Maintenance',
    author: 'Robert Pirsig',
    href: 'https://www.amazon.com/Zen-Art-Motorcycle-Maintenance-Inquiry/dp/0061673730',
    type: 'book',
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    href: 'https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299',
    type: 'book',
  },
  {
    title: 'Good to Great',
    author: 'Jim Collins',
    href: 'https://www.amazon.com/Good-Great-Some-Companies-Others/dp/0066620996',
    type: 'book',
  },
  {
    title: 'Crucial Conversations',
    author: 'Kerry Patterson et al.',
    href: 'https://www.amazon.com/Crucial-Conversations-Talking-Stakes-Second/dp/0071771328',
    type: 'book',
  },
  {
    title: 'The Goal',
    author: 'Eliyahu Goldratt',
    href: 'https://www.amazon.com/Goal-Process-Ongoing-Improvement/dp/0884271951',
    type: 'book',
  },
  {
    title: 'The Hard Thing About Hard Things',
    author: 'Ben Horowitz',
    href: 'https://www.amazon.com/Hard-Thing-About-Things-Building/dp/0062273205',
    type: 'book',
  },
  {
    title: 'Poke the Box',
    author: 'Seth Godin',
    href: 'https://www.amazon.com/Poke-Box-Seth-Godin/dp/1936719002',
    type: 'book',
  },
  {
    title: 'Sondheim, Seurat, Software: Finding Art in Code',
    author: 'Jon Skeet',
    href: 'https://www.youtube.com/watch?v=FsPkHGt1p2c',
    type: 'video',
  },
  {
    title: 'Inventing on Principle',
    author: 'Bret Victor',
    href: 'https://www.youtube.com/watch?v=EGqwXt90ZqA',
    type: 'video',
  },
  {
    title: 'We Are The Art',
    author: 'Brandon Sanderson',
    href: 'https://www.youtube.com/watch?v=mb3uK-_QkOo',
    type: 'video',
  },
  {
    title: 'Propositions As Types',
    author: 'Philip Wadler',
    href: 'https://homepages.inf.ed.ac.uk/wadler/papers/propositions-as-types/propositions-as-types.pdf',
    type: 'paper',
  },
  {
    title: 'The Cathedral and the Bazaar',
    author: 'Eric S. Raymond',
    href: 'https://monoskop.org/images/e/e0/Raymond_Eric_S_The_Cathedral_and_the_Bazaar_rev_ed.pdf',
    type: 'paper',
  },
];

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
        <h1 className="font-serif text-4xl font-normal text-warm-800">
          The &ldquo;Short&rdquo; Version of Me
        </h1>
      </header>

      {/* Intro Quote */}
      <div className="mb-12 rounded-xl border-l-[3px] border-warm-600 bg-white/50 px-8 py-6">
        <Prose>
          If you&apos;re here, you&apos;re probably considering working with me or we&apos;re about
          to start. Here&apos;s the context I want you to have: how I think, how I communicate, what
          I value, and what to expect from me.
        </Prose>
      </div>

      {/* My Philosophy */}
      <Section title="My Philosophy">
        <Belief>
          <strong>I&apos;m driven to unlock potential</strong> - equipping people and creating
          environments where they can express their true strengths in tangible ways that lead to
          real results.
        </Belief>
        <Belief>
          <strong>I believe the best software is built by people for people</strong> - an artistic
          endeavor rooted in engineering sensibility. The knowledge the team holds is the true
          value; the code is the easy part.
        </Belief>
        <Belief>
          <strong>The magic happens</strong> when software makes a formerly difficult or tedious
          task disappear, surfaces that critical bit of data at the right moment, or maps the real
          world to the user&apos;s journey in a way that just <em>works</em>. That&apos;s what great
          software is - not the loops, objects, buttons, or text boxes.
        </Belief>
        <Belief>
          <strong>Great software requires more than code.</strong> Product thinking, design
          sensibility, technical execution - each is essential. The best outcomes come from
          different perspectives collaborating as equals.
        </Belief>
        <Belief>
          <strong>Understanding comes first.</strong> Every situation is different. I seek to learn
          about the people, the product, the history, and the constraints before forming a point of
          view.
        </Belief>
        <Belief>
          <strong>I believe in Conway&apos;s Law:</strong> software will evolve to match the team
          that creates it. This is why people matter so much. You can&apos;t separate product
          quality from team quality. Fix the team, and the software follows.
        </Belief>
        <Belief>
          <strong>Strong opinions, loosely held, humbly expressed.</strong> What I mean: my opinions
          come from real experience and hard-won lessons - they have reasons behind them. But
          I&apos;ve also learned that the world is bigger than what I&apos;ve seen, so I hold them
          loosely, committed to the best idea winning.
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
        <Subsection title="Meeting the Moment" />
        <Prose>
          My role shifts as the product and team evolve. I step into whatever is needed most, then
          deliberately create space for others to grow into.
        </Prose>
        <Prose>
          <strong>Founder / Early Stage:</strong> When there&apos;s a vision but no team yet, I
          function as the founding engineer and team builder. I&apos;m hands-on in the code,
          translating vision to roadmap to working software, while simultaneously recruiting and
          shaping the team that will carry it forward.
        </Prose>
        <Prose>
          <strong>Team Forming:</strong> As the team takes shape, I fill the gaps - CTO, architect,
          principal engineer, whatever the team needs most. The title matters less than the
          function. I keep the foundation secure while people find their footing.
        </Prose>
        <Prose>
          <strong>Team In Place:</strong> Once the team has its legs, I shift into coaching and
          mentoring. My job becomes developing their capacity, not doing the work myself. I push
          them to figure it out, but I&apos;m always there as a safety net while they build
          confidence.
        </Prose>
        <Prose>
          <strong>Rolling Out:</strong> The goal is always working myself out of the day-to-day.
          When the team is hitting its stride and running things themselves, I step back - available
          when needed, but out of the way. Success is the team thriving, and knowing I&apos;m a
          phone call away if something unusual comes up.
        </Prose>

        <Subsection title="Understanding the Whole Picture" />
        <Prose>
          Whether I&apos;m starting from scratch, stepping into something established, or diagnosing
          why something isn&apos;t working - I start the same way: by seeking to understand.
        </Prose>
        <Prose>
          <strong>On a greenfield build,</strong> that means understanding the vision, the
          constraints, the market, and the users - sometimes through research, sometimes by building
          to learn. The best architecture emerges from understanding the problem deeply.
        </Prose>
        <Prose>
          <strong>On an existing product,</strong> that means learning the history - why decisions
          were made, what&apos;s been tried, what the team has learned. Context isn&apos;t a luxury;
          it&apos;s the foundation.
        </Prose>
        <Prose>
          <strong>When something&apos;s not working,</strong> my instinct is to look at the system,
          not the individuals. The issue is rarely the people-it&apos;s usually something about the
          environment, the process, or the information flow that&apos;s getting in their way.
        </Prose>
        <Prose>
          In all cases, the goal is the same: understand deeply so we can craft the right container
          for success.
        </Prose>

        <Subsection title="Communication" />
        <Prose>
          Much of my career has been spent as a bridge-between developers and stakeholders,
          technical teams and business leadership, product and engineering. I translate naturally,
          adjusting my language based on who I&apos;m talking to and what they need to hear. I
          won&apos;t bury a founder in implementation details or oversimplify for a senior engineer.
        </Prose>
        <Prose>
          I also spend a lot of time helping teams build this muscle themselves - coaching
          architects to communicate with executives, establishing rhythms so the right conversations
          happen at the right level with the right people.
        </Prose>
        <Prose>
          <strong>I match medium to message:</strong>
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
                <td className="py-2 pr-4">Information sharing</td>
                <td className="py-2 pr-4">Slack async, email</td>
                <td className="py-2">Doesn&apos;t interrupt flow</td>
              </tr>
              <tr className="border-b border-warm-400/30">
                <td className="py-2 pr-4">Decision making</td>
                <td className="py-2 pr-4">Slack sync</td>
                <td className="py-2">Often evolves from info sharing</td>
              </tr>
              <tr className="border-b border-warm-400/30">
                <td className="py-2 pr-4">Collaboration</td>
                <td className="py-2 pr-4">Video when text hits ~20+ messages</td>
                <td className="py-2">Real-time is faster past a threshold</td>
              </tr>
              <tr className="border-b border-warm-400/30">
                <td className="py-2 pr-4">Ideation</td>
                <td className="py-2 pr-4">Video + visual tools</td>
                <td className="py-2">Ideas need room to breathe</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Conflict resolution</td>
                <td className="py-2 pr-4">Video/audio required</td>
                <td className="py-2">Non-verbals matter</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Prose>
          Once decisions are made in real-time conversation, they should be captured in Slack and/or
          a knowledge base.
        </Prose>
        <Prose>
          Communication is a two-way street. I value directness, honesty, and clarity - and I want
          the same from you. Don&apos;t pull punches; I can take it. The faster we get to
          transparency, the faster we get to the real work.
        </Prose>
        <Prose>Clarity is kindness. Ambiguity is expensive.</Prose>

        <Subsection title="Meetings" />
        <Prose>
          I don&apos;t hate meetings - just the bad ones. A good meeting has a clear purpose, the
          right people, and ends with decisions or next steps.
        </Prose>
        <Prose>I think about time in three rhythms:</Prose>
        <Prose>
          <strong>Meetings</strong> - for decisions, coordination, and moving things forward.
        </Prose>
        <Prose>
          <strong>Maker time</strong> - for deep focused work. This is where code gets written and
          hard problems get solved. Uninterrupted time matters.
        </Prose>
        <Prose>
          <strong>Collaboration time</strong> - for ideation and creative problem-solving together.
          Whiteboarding, brainstorming, exploring possibilities. Different work, different energy.
        </Prose>
        <Prose>
          All three matter. I&apos;m intentional about crafting schedules that let people bring
          their best to the moment.
        </Prose>
        <Prose>
          <strong>A confession:</strong> I&apos;m a storyteller. I&apos;ll admit to sometimes being
          the cause of a meeting going off course. Feel free to nudge me back on track. But
          there&apos;s also value - especially in virtual environments - in spending some time on
          the personal and relational. Identifying the constraints of the meeting upfront helps us
          balance both.
        </Prose>

        <Subsection title="Calendar" />
        <Prose>
          You can trust my calendar. I work across multiple contexts and invest in keeping it
          accurate. What you see is real.
        </Prose>
        <Prose>Life happens. When it does, I communicate early - and appreciate the same.</Prose>

        <Subsection title="Responsiveness" />
        <Prose>
          I try to be responsive on Slack (then email) and never want to be a blocker. If I&apos;m
          going to be unavailable, you&apos;ll know beforehand.
        </Prose>
        <Prose>
          My style is thinking out loud - short messages, quick replies, working through ideas in
          real-time rather than going quiet and returning with a polished answer. If you need a
          synthesized take, just ask.
        </Prose>
      </Section>

      {/* 1:1s */}
      <Section title="1:1s">
        <Prose>
          1:1s are primarily for you, not me. It&apos;s your time and space to get what you need,
          express your thoughts and opinions. It&apos;s not a status report - it&apos;s a true
          check-in on how you&apos;re doing, what&apos;s occupying your thoughts, and what you need
          to be happy and effective.
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
          <strong>Direct, transparent communication</strong> - say what you mean.
        </Prose>
        <Prose>
          <strong>Addressing problems early</strong> - confronting concerns head-on prevents them
          from becoming larger issues.
        </Prose>
        <Prose>
          <strong>Curiosity and understanding</strong> - dig into a problem before escalating. Come
          with what you&apos;ve tried and what you&apos;ve learned. At the same time, know when to
          stop spinning and ask-there&apos;s value in talking to the duck (or a human).
        </Prose>
        <Prose>
          <strong>Understanding over output</strong> - AI and automation can help, but you
          can&apos;t outsource comprehension. You still need to understand the problem and the
          solution.
        </Prose>
        <Prose>
          <strong>Craftsmanship</strong> - I appreciate work that&apos;s thoughtful, elegant,
          consistent, and built to last. Code, process, or presentation - same standard.
        </Prose>
        <Prose>
          <strong>Different lenses, better outcomes</strong> - the best solutions come from product,
          design, and engineering working together. I value seeking out perspectives different from
          my own.
        </Prose>
        <Prose>
          <strong>Doing the right thing</strong> - regardless of the immediate cost.
        </Prose>
        <Prose>
          <strong>Ownership</strong> - if there&apos;s a problem, it&apos;s everyone&apos;s problem
          until it&apos;s solved. Origin doesn&apos;t matter; solving it does.
        </Prose>
      </Section>

      {/* What to Know About Me */}
      <Section title="What to Know About Me">
        <Subsection title="How I'm Wired" />
        <Prose>
          I come alive when I&apos;m creating, solving hard problems, and learning something new.
          The harder the puzzle, the better. I love being on the frontier - taking an idea and
          making it real. Few things beat the moment when a complex problem finally clicks into
          place.
        </Prose>
        <Prose>
          My brain tends to leap from A to D, and walking back through B and C takes real effort.
          Repeating the same explanation multiple times wears on me. I find it frustrating when
          clear decisions get blocked by politics or ego rather than substance.
        </Prose>
        <Prose>
          I know this about myself. If I&apos;m moving too fast, slow me down. If you need me to
          explain my reasoning, ask - I&apos;d rather do that than have you feel left behind.
        </Prose>
        <Prose>
          One more thing: I tend to solve a problem and move onto the next one without pausing to
          celebrate. If I move on quickly, it&apos;s not a lack of caring - feel free to pull me
          back.
        </Prose>

        <Subsection title="Relationships Outlast Roles" />
        <Prose>
          I approach people as humans first, colleagues second. People I worked with years ago still
          reach out - trading career advice, debugging problems together, catching up on life.
          That&apos;s what makes the work worth it.
        </Prose>

        <Subsection title="Personal Context" />
        <Prose>
          <strong>I have ADHD and OCD.</strong> I&apos;ve learned to channel them productively, but
          they show up in ways you might notice - intensity of focus, attention to detail, and an
          innate rigidity about time. Naming this helps explain behaviors that might otherwise seem
          arbitrary.
        </Prose>
        <Prose>
          <strong>
            I&apos;m a{' '}
            <Link to="/running" className="text-warm-600 underline hover:text-warm-800">
              runner
            </Link>
            .
          </strong>{' '}
          It&apos;s taught me that I can keep going longer than I think I can and that most limits
          are negotiable.
        </Prose>
        <Prose>
          <strong>I love to cook and bake</strong> - same maker wiring, different medium.
        </Prose>

        <Subsection title="Work Hours" />
        <Prose>
          I&apos;m generally available 9&ndash;6 EST, but I&apos;m rarely fully offline. I weave
          personal and work together so both get my best - not rigid separation. That said, my
          availability doesn&apos;t create expectations for yours. Take care of yourself, be
          flexible, and communicate openly. I&apos;ll do the same.
        </Prose>
      </Section>

      {/* Feedback & Accountability */}
      <Section title="Feedback & Accountability">
        <Prose>These are expectations I hold for myself - and for the teams I work with.</Prose>
        <Prose>
          <strong>Call me on my BS.</strong> I mean it. I commit to listening, seeking to
          understand, and having an honest conversation. We might not always agree, but we will
          always hear each other.
        </Prose>
        <Prose>
          <strong>Consequences are the truth.</strong> Good intentions don&apos;t erase impact. I
          own the results of my actions, not just my intentions - and I expect the same.
        </Prose>
        <Prose>
          <strong>No time machines.</strong> When something goes wrong, acknowledge it, learn from
          it, and solve the reality we&apos;re facing. That doesn&apos;t mean ignoring the emotional
          or relational fallout - those are part of the reality too.
        </Prose>
        <Prose>
          <strong>Apologies need legs.</strong> Making it right means actually making it right - not
          just saying the words.
        </Prose>
      </Section>

      {/* Books & Ideas */}
      <Section title="Books & Ideas That Shape My Thinking">
        <div className="space-y-3">
          {sources.map((source) => (
            <SourceLink key={source.title} {...source} />
          ))}
        </div>
      </Section>

      {/* Assessments */}
      <Section title="Assessments">
        <Subsection title="DISC: D-Style" />
        <Prose>
          Direct, results-oriented, takes charge. My intensity varies by context - more directive
          when building foundations, more coaching-oriented as teams mature.
        </Prose>

        <Subsection title="CliftonStrengths Top 10" />
        <Prose>{cliftonStrengths.join(', ')}</Prose>
        <Prose>
          I lead with Strategic Thinking: absorb and analyze information to inform better decisions.
        </Prose>

        <Subsection title="Enneagram: Type 8 (The Challenger)" />
        <Prose>
          Protective, direct, ownership-oriented. Stand up for what I believe in, fight for those I
          care about.
        </Prose>

        <Subsection title="Sparketype: Maven / Maker" />
        <Prose>Energized by learning deeply, then building something with it.</Prose>

        <Subsection title="Predictive Index: Captain" />
        <Prose>
          Problem solver who drives change and innovation while controlling the big picture.
        </Prose>

        <Subsection title="MCORE: Overcome, Experience the Ideal, Establish" />
        <Prose>
          Motivated by winning out over obstacles, living out ideas and values, and building things
          that last.
        </Prose>
      </Section>
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

const SourceLink = ({title, author, href, type}: Source) => (
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
      {match(type)
        .with('video', () => (
          <span className="ml-2 rounded bg-warm-600/15 px-1.5 py-0.5 text-[0.7rem] text-warm-600">
            video
          </span>
        ))
        .with('paper', () => (
          <span className="ml-2 rounded bg-warm-600/15 px-1.5 py-0.5 text-[0.7rem] text-warm-600">
            paper
          </span>
        ))
        .with('book', () => null)
        .exhaustive()}
    </div>
  </div>
);
