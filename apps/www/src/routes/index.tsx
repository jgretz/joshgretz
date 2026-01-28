import {createFileRoute} from '@tanstack/react-router';
import joshAvatar from '../assets/images/josh-g.png';
import {MountainRunner} from '../components/illustrations/mountain-runner';
import {Underline} from '../components/illustrations/underline';
import {PageWrapper} from '../components/layout/page-wrapper';
import {Avatar} from '../components/ui/avatar';
import {GitHubIcon, InstagramIcon, LinkedInIcon, StravaIcon} from '../components/ui/icons';
import {SocialLink} from '../components/ui/social-link';
import {TagPill} from '../components/ui/tag-pill';
import {title} from '../config.shared';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      {title: title()},
      {name: 'description', content: 'Josh Gretz - Polymath, Builder, CTO, Runner'},
    ],
  }),
  component: Index,
});

const tags = ['Polymath', 'Builder', 'CTO', 'Runner'];

const socials = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/joshgretz',
    icon: <LinkedInIcon className="h-4 w-4" />,
  },
  {label: 'GitHub', href: 'https://github.com/jgretz', icon: <GitHubIcon className="h-4 w-4" />},
  {
    label: 'Strava',
    href: 'https://www.strava.com/athletes/joshgretz',
    icon: <StravaIcon className="h-4 w-4" />,
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/joshgretz',
    icon: <InstagramIcon className="h-4 w-4" />,
  },
];

function Index() {
  return (
    <PageWrapper className="flex min-h-screen items-center">
      <div className="grid w-full gap-16 lg:grid-cols-2">
        {/* Left: Content */}
        <div className="pt-8">
          <Avatar src={joshAvatar} alt="Josh Gretz" size="lg" className="mb-8" />

          <h1 className="mb-6 font-serif text-[3.5rem] font-normal leading-tight text-warm-800">
            Hi, I'm{' '}
            <span className="relative inline-block whitespace-nowrap italic text-warm-600">
              Josh Gretz
              <Underline className="absolute -bottom-2 left-0 h-3 w-full" />
            </span>
            .
          </h1>

          <div className="mb-8 flex max-w-[500px] flex-col gap-3 font-sans text-lg leading-relaxed text-warm-700">
            <p>Husband, father, developer, cook, baker, nerd, geek.</p>
            <p>
              I have strong opinions, yet try to hold them loosely, and strive to express them
              humbly.
            </p>
            <p>
              I'm driven to see genius realized through the fusion of ideas, collaboration, and hard
              work.
            </p>
            <p>
              I believe the best software is built by people for people — an artistic endeavor
              rooted in engineering sensibility.
            </p>
          </div>

          <div className="mb-8 flex flex-wrap gap-3">
            {tags.map((tag) => (
              <TagPill key={tag}>{tag}</TagPill>
            ))}
          </div>

          <div className="flex gap-4">
            {socials.map((social) => (
              <SocialLink
                key={social.label}
                href={social.href}
                label={social.label}
                icon={social.icon}
              />
            ))}
          </div>
        </div>

        {/* Right: Hero Illustration */}
        <div className="flex items-center justify-center">
          <MountainRunner className="w-full max-w-[450px]" />
        </div>
      </div>
    </PageWrapper>
  );
}
