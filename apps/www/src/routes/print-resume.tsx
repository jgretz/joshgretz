import {createFileRoute} from '@tanstack/react-router';
import {title} from '../config.shared';
import {contactLinks, education, experience, skills} from '../data/resume-data';

export const Route = createFileRoute('/print-resume')({
  head: () => ({
    meta: [{title: title('Resume - Print')}, {name: 'description', content: 'Josh Gretz - Resume'}],
  }),
  component: PrintResume,
});

function PrintResume() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl p-8 text-black print:p-0">
        {/* Header */}
        <header className="mb-6 border-b border-gray-300 pb-4">
          <h1 className="mb-1 text-3xl font-bold">Josh Gretz</h1>
          <p className="mb-2 text-lg text-gray-700">Technical Leader & Fractional CTO</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {contactLinks.map((link) => (
              <span key={link.label}>
                {link.label}: {link.href.replace('mailto:', '')}
              </span>
            ))}
          </div>
        </header>

        {/* Summary */}
        <section className="mb-6">
          <p className="text-sm leading-relaxed text-gray-800">
            I believe highly functioning software teams make the world better. I'm a builder - of
            software, of teams, of organizations. Developer, architect, leader, executive: I've
            succeeded at every level, and I remain hands-on because the best technical leaders never
            leave the keyboard.
          </p>
        </section>

        {/* Experience */}
        <section className="mb-6">
          <h2 className="mb-3 border-b border-gray-200 pb-1 text-lg font-bold">Experience</h2>

          {experience.map((job) => (
            <div key={job.id} className="mb-5">
              <div className="mb-1">
                <h3 className="text-base font-bold">{job.company}</h3>
                <div className="flex flex-wrap justify-between text-sm">
                  <span className="font-medium">{job.role}</span>
                  <span className="text-gray-600">
                    {job.period} · {job.location}
                  </span>
                </div>
              </div>

              <p className="mb-2 text-sm text-gray-800">{job.summary}</p>

              {job.highlights.map((section) => (
                <div key={section.category} className="mb-2">
                  <h4 className="text-sm font-medium italic">{section.category}</h4>
                  <ul className="ml-4 list-disc text-sm text-gray-800">
                    {section.items.map((item) => (
                      <li key={item} className="mb-0.5">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </section>

        {/* Education */}
        <section className="mb-6">
          <h2 className="mb-3 border-b border-gray-200 pb-1 text-lg font-bold">Education</h2>

          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <h3 className="text-base font-bold">{edu.institution}</h3>
              <div className="flex flex-wrap justify-between text-sm">
                <span>
                  {edu.degree} {edu.field}
                </span>
                <span className="text-gray-600">
                  {edu.period} · {edu.location}
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* Skills */}
        <section>
          <h2 className="mb-3 border-b border-gray-200 pb-1 text-lg font-bold">Skills</h2>

          <div className="grid grid-cols-2 gap-3 text-sm">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category}>
                <h3 className="mb-0.5 font-medium">{category}</h3>
                <p className="text-gray-700">{items.join(', ')}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
