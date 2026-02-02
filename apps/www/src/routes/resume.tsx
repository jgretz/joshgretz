import {createFileRoute} from '@tanstack/react-router';
import {useMemo, useState} from 'react';
import joshAvatar from '../assets/images/josh-g.png';
import {PageWrapper} from '../components/layout/page-wrapper';
import {Avatar} from '../components/ui/avatar';
import {ExpandableSection} from '../components/ui/expandable-section';
import {EmailIcon, GitHubIcon, LinkedInIcon, WebIcon} from '../components/ui/icons';
import {SectionHeader} from '../components/ui/section-header';
import {title} from '../config.shared';
import {contactLinks, education, experience, skills} from '../data/resume-data';
import {cn} from '../lib/styles';

export const Route = createFileRoute('/resume')({
  head: () => ({
    meta: [{title: title('Resume')}, {name: 'description', content: 'Josh Gretz - Resume'}],
  }),
  component: Resume,
});

const iconMap: Record<string, React.ReactNode> = {
  Email: <EmailIcon className="h-3 w-3" />,
  LinkedIn: <LinkedInIcon className="h-3 w-3" />,
  GitHub: <GitHubIcon className="h-3 w-3" />,
  ForceBuilders: <WebIcon className="h-3 w-3" />,
};

function Resume() {
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const visibleExperience = useMemo(() => experience.filter((job) => !job.printOnly), []);

  const isExpanded = (id: string) => expandedRole === id;

  return (
    <PageWrapper maxWidth="4xl">
      {/* Header */}
      <header className="relative mb-12 flex flex-col gap-6 border-b border-warm-700/15 pb-8 sm:flex-row sm:items-start">
        <a
          href="/josh-gretz-resume.pdf"
          download
          className="no-print absolute right-0 top-0 flex items-center gap-1.5 rounded-md border border-warm-700/20 px-3 py-2 font-sans text-xs text-warm-600 hover:bg-warm-700/5"
        >
          Download Resume
        </a>

        <Avatar src={joshAvatar} alt="Josh Gretz" size="md" className="shrink-0 border-[3px]" />

        <div className="flex-1">
          <h1 className="mb-1 font-serif text-4xl font-normal text-warm-800">Josh Gretz</h1>
          <p className="mb-4 font-sans text-lg text-warm-600">Technical Leader & Fractional CTO</p>
          <p className="max-w-[600px] font-sans text-[0.95rem] leading-relaxed text-warm-700">
            I believe highly functioning software teams make the world better. I'm a builder - of
            software, of teams, of organizations. Developer, architect, leader, executive: I've
            succeeded at every level, and I remain hands-on because the best technical leaders never
            leave the keyboard.
          </p>
        </div>
      </header>

      {/* Two Column Layout */}
      <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
        {/* Left Column - Experience */}
        <div>
          <SectionHeader>Experience</SectionHeader>

          {visibleExperience.map((job, index) => (
            <div
              key={job.id}
              className={cn(
                index < visibleExperience.length - 1
                  ? 'mb-10 border-b border-warm-700/10 pb-10'
                  : 'mb-6',
              )}
            >
              <div className="mb-4">
                <h3 className="mb-1 font-serif text-xl font-normal text-warm-800">
                  <a
                    href={job.companyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-warm-600"
                  >
                    {job.company}
                  </a>
                </h3>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-sans text-base font-medium text-warm-700">{job.role}</span>
                  <span className="font-sans text-sm text-warm-500">
                    {job.period} · {job.location}
                  </span>
                </div>
              </div>

              <p className="mb-4 font-sans text-[0.95rem] leading-relaxed text-warm-700">
                {job.summary}
              </p>

              <ExpandableSection isOpen={isExpanded(job.id)}>
                {job.highlights.map((section) => (
                  <div key={section.category} className="mb-5">
                    <h4 className="mb-3 font-sans text-sm font-medium italic text-warm-700">
                      {section.category}
                    </h4>
                    <ul className="m-0 list-none p-0">
                      {section.items.map((item) => (
                        <li
                          key={item}
                          className="relative mb-2 pl-4 font-sans text-sm leading-relaxed text-warm-700"
                        >
                          <span className="absolute left-0 text-warm-400">·</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </ExpandableSection>

              <button
                type="button"
                onClick={() => setExpandedRole(expandedRole === job.id ? null : job.id)}
                className="mt-2 flex items-center gap-2 font-sans text-sm text-warm-600"
              >
                <span className="inline-block">{isExpanded(job.id) ? '↑' : '↓'}</span>
                {isExpanded(job.id) ? 'Show less' : 'Show highlights'}
              </button>
            </div>
          ))}

          {/* Earlier chapters blurb */}
          <div className="rounded-xl border border-warm-700/10 bg-white/40 px-6 py-5">
            <p className="mb-2 font-handwriting text-lg text-warm-600">Earlier chapters...</p>
            <p className="font-sans text-sm leading-relaxed text-warm-700">
              Prior roles include Software Architect, Senior Engineer, and Engineer positions where
              I built the foundation for everything above.
              <br />
              <br />
              <a
                href="/josh-gretz-resume.pdf"
                download
                className="text-warm-600 underline hover:text-warm-800"
              >
                Full history
              </a>{' '}
              available.
            </p>
          </div>

          {/* Education Section */}
          <SectionHeader className="mt-10">Education</SectionHeader>
          {education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <h3 className="mb-1 font-serif text-xl font-normal text-warm-800">
                {edu.institution}
              </h3>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-sans text-base font-medium text-warm-700">
                  {edu.degree} {edu.field}
                </span>
                <span className="font-sans text-sm text-warm-500">
                  {edu.period} · {edu.location}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column - Sidebar */}
        <aside>
          {/* Contact */}
          <div className="mb-10 rounded-xl bg-warm-700/[0.08] p-5">
            <h2 className="mb-4 font-sans text-base font-medium text-warm-700">Let's Connect</h2>
            <div className="flex flex-col gap-2">
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 font-sans text-sm text-warm-600 hover:opacity-80"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-warm-700 text-[0.65rem] text-warm-50">
                    {iconMap[link.label]}
                  </span>
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <SectionHeader>Skills</SectionHeader>

            {Object.entries(skills).map(([category, items]) => (
              <div key={category} className="mb-6">
                <h3 className="mb-3 font-sans text-sm font-medium text-warm-700">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-warm-700/15 bg-white/50 px-3 py-1.5 font-sans text-xs text-warm-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </PageWrapper>
  );
}
