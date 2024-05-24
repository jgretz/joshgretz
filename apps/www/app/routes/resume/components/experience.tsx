import {type PropsWithChildren} from 'react';
import {Section} from './section';

// Job Container
function Job({children}: PropsWithChildren) {
  return <li className="mb-4">{children}</li>;
}

// Job Title
interface JobTitleProps {
  title: string;
  company: string;
  companylink: string;
  tenure: string;
  location: string;
}

function JobTitle({title, company, companylink, tenure, location}: JobTitleProps) {
  return (
    <div>
      <div className="text-lg font-semibold leading-snug">
        <span>{title}</span>
        <span className="text-secondary"> @ </span>
        <span className="text-secondary">
          <a href={companylink} target="_blank" rel="noreferrer">
            {company}
          </a>
        </span>
      </div>
      <div className="text-sm leading-normal">
        <span>{tenure}</span>
        <span> || {location}</span>
      </div>
    </div>
  );
}

// Job Detail
function JobDetail({children}: PropsWithChildren) {
  return (
    <li className="ml-1.5 mt-2 flex flex-row text-sm leading-normal">
      <div className="mr-1 mt-1 text-xs">{'* '}</div>
      <div>{children}</div>
    </li>
  );
}

// Experience
export default function Experience() {
  return (
    <div>
      <Section>Experience</Section>
      <ul>
        <Job>
          <JobTitle
            title="CTO & Co-Founder"
            company="ForceBuilders"
            companylink="https://www.forcebuilders.io"
            tenure="April 2023 - Present"
            location="Remote, USA"
          />
        </Job>
        <Job>
          <JobTitle
            title="CTO"
            company="Truefit"
            companylink="https://www.truefit.io"
            tenure="June 2015 - Present"
            location="Remote, USA, Pittsburgh"
          />

          <ul>
            <JobDetail>
              Responsible for establishing and maintaining Truefit as a thought leader in the
              industry.
            </JobDetail>
            <JobDetail>Create a culture of continual experimentation and improvement.</JobDetail>
            <JobDetail>
              Research and assess the outside world, assessing changes and communicating their
              effect on Truefit.
            </JobDetail>
            <JobDetail>
              Define and implement best practices and ensure consistent application of software
              architecture across teams and products.
            </JobDetail>
            <JobDetail>
              Coordinate with operations, senior contributors, and R&D to ensure Truefit is equipped
              and ready to meet the challenges of current and future projects.
            </JobDetail>
            <JobDetail>
              Collaborate with operations and senior contributors to establish and improve support
              approaches, practices, and deliverables.
            </JobDetail>
            <JobDetail>Mentor developers through 1:1 relationships.</JobDetail>
            <JobDetail>
              Solidify and strengthen the team by recruiting excellent new recruits and engaging
              existing team members.
            </JobDetail>
          </ul>
        </Job>
        <Job>
          <JobTitle
            title="Director of Engineering"
            company="Truefit"
            companylink="https://www.truefit.io"
            tenure="August 2013 - June 2015"
            location="Remote, USA, Pittsburgh"
          />
          <ul>
            <JobDetail>
              Define and implement architectural best practices and ensure consistent application of
              software architecture across teams and products
            </JobDetail>
            <JobDetail>
              Research, collect, and create tools, frameworks, and reusable components.
            </JobDetail>
            <JobDetail>
              Lead the organization of our product development efforts and equip teams to deliver
              effectively and achieve their goals and thrill their customers.
            </JobDetail>
            <JobDetail>
              Strategically distribute talent and skills to create diverse, creative, effective
              teams.
            </JobDetail>
            <JobDetail>
              Optimize the workload across teams and ensure our ability to make and keep client
              commitments.
            </JobDetail>
            <JobDetail>Develop the culture by recruiting engineering talent.</JobDetail>
          </ul>
        </Job>
        <Job>
          <JobTitle
            title="Software Architect"
            company="Truefit"
            companylink="https://www.truefit.io"
            tenure="January 2010 - August 2013"
            location="USA, Pittsburgh"
          />
          <ul>
            <JobDetail>Design systems with solid architectural foundations.</JobDetail>
            <JobDetail>
              Choose the proper technological stack to meet the project and client needs, with a
              sensitivity to business drivers and ability to incorporate them into the architecture.
            </JobDetail>
            <JobDetail>Build elegant solutions by actively writing awesome code.</JobDetail>
            <JobDetail>Provide technical and cultural leadership.</JobDetail>
          </ul>
        </Job>
        <Job>
          <JobTitle
            title="Adjunct Professor"
            company="Grove City College"
            companylink="https://www.gcc.edu"
            tenure="January 2009 - January 2013"
            location="USA, Grove City - PA"
          />
          <ul>
            <JobDetail>Developed ciriculumn for senior level mobile development course.</JobDetail>
            <JobDetail>Lectured twice weekly to classes of 15 - 25 students.</JobDetail>
            <JobDetail>Mentored and coached students on a variety technical topics.</JobDetail>
          </ul>
        </Job>
        <Job>
          <JobTitle
            title="Senior Software Engineer"
            company="Truefit"
            companylink="https://www.truefit.io"
            tenure="January 2008 - January 2010"
            location="USA, Pittsburgh"
          />
          <ul>
            <JobDetail>Build elegant solutions by actively writing awesome code.</JobDetail>
            <JobDetail>Provide technical and cultural leadership.</JobDetail>
            <JobDetail>Consistently complete tasks within estimates.</JobDetail>
            <JobDetail>Exemplify engineering best practices by example.</JobDetail>
            <JobDetail>Execute agile process to provide a smooth customer experience.</JobDetail>
          </ul>
        </Job>
        <Job>
          <JobTitle
            title="Software Engineer"
            company="Truefit"
            companylink="https://www.truefit.io"
            tenure="May 2004 - January 2008"
            location="USA, Pittsburgh"
          />
          <ul>
            <JobDetail>Deliver awesome, clear, concise, and solid code.</JobDetail>
            <JobDetail>Execute agile process to provide a smooth customer experience.</JobDetail>
          </ul>
        </Job>
        <Job>
          <JobTitle
            title="Intern Software Engineer"
            company="Truefit"
            companylink="https://www.truefit.io"
            tenure="May 2003 - January 2004"
            location="USA, Pittsburgh"
          />
        </Job>
      </ul>
    </div>
  );
}
