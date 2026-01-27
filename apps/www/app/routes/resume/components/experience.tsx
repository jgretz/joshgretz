import {type PropsWithChildren} from 'react';
import {Section} from './section';

// Company container - groups multiple roles under one employer
interface CompanyProps {
  name: string;
  link: string;
  children: React.ReactNode;
}

function Company({name, link, children}: CompanyProps) {
  return (
    <div className="mb-6">
      <div className="text-lg font-semibold">
        <a href={link} target="_blank" rel="noreferrer" className="text-secondary hover:underline">
          {name}
        </a>
      </div>
      {children}
    </div>
  );
}

// Role within a company
interface RoleProps {
  title: string;
  tenure: string;
  location?: string;
  children?: React.ReactNode;
}

function Role({title, tenure, location, children}: RoleProps) {
  return (
    <div className="mb-4">
      <div className="font-medium">{title}</div>
      <div className="text-xs text-secondary">
        {tenure}
        {location && ` | ${location}`}
      </div>
      {children}
    </div>
  );
}

// Sub-section within a role (e.g., "Engineering & Team Building")
interface RoleSectionProps {
  title: string;
  children: React.ReactNode;
}

function RoleSection({title, children}: RoleSectionProps) {
  return (
    <div className="mt-2">
      <div className="text-sm font-semibold italic">{title}</div>
      {children}
    </div>
  );
}

// Bullet point item
function Bullet({children}: PropsWithChildren) {
  return (
    <li className="mt-1 flex flex-row text-sm leading-normal">
      <div className="mr-2">•</div>
      <div>{children}</div>
    </li>
  );
}

// Paragraph text within a role
function RoleText({children}: PropsWithChildren) {
  return <p className="mt-2 text-sm leading-relaxed">{children}</p>;
}

export default function Experience() {
  return (
    <div>
      <Section>Experience</Section>

      <Company name="ForceBuilders" link="https://www.forcebuilders.io">
        <Role title="Co-Founder & CTO" tenure="April 2023 – Present" location="Remote">
          <RoleText>
            We help organizations build and scale highly functioning software teams — with a focus
            on People, Process, and Product. We ignite potential, empower teams, and step back when
            they can run without us.
          </RoleText>

          <RoleSection title="Fractional CTO Engagements">
            <ul>
              <Bullet>
                <span className="font-medium">Healthcare IoT Startup:</span> Established the
                software organization from zero for a connected medical device company. Hired
                architect and developers. Helped lay the architecture track (Node, React, React
                Native, BLE integration) and took stories alongside the team. Shipped V1 then
                executed a structured phase-out.
              </Bullet>
              <Bullet>
                <span className="font-medium">Merchant Services Company:</span> Partnered with
                leadership to build a 10+ person cross functional team. Established architecture
                (Node, React, TypeScript), SDLC, and tooling in a PCI-compliant environment.
                Collaborated with the PO on backlog development and execution. Team shipped V1 with
                new market capabilities including API integration and AI-enabled intake. 18-month
                engagement ending with clean handoff.
              </Bullet>
              <Bullet>
                <span className="font-medium">Software Consultancy Transition:</span> Designed a
                timed transition plan to exit the organization I helped build over 20 years. Trained
                successor and established a cross-practice leadership structure to steward technical
                and process standards so the company could operate independently.
              </Bullet>
            </ul>
          </RoleSection>

          <RoleSection title="Technical Due Diligence">
            <ul>
              <Bullet>
                <span className="font-medium">Fintech VC Portfolio Evaluation:</span> Engaged by a
                VC firm to assess a portfolio company that had not met expectations. Conducted a
                thorough code review, team evaluation, and infrastructure audit. Delivered candid
                findings that gave the board clarity to make an informed investment decision.
              </Bullet>
            </ul>
          </RoleSection>
        </Role>
      </Company>

      <Company name="Truefit" link="https://www.truefit.io">
        <Role title="CTO" tenure="June 2015 – November 2024" location="Pittsburgh, PA">
          <RoleText>
            Led the technical vision, engineering organization, and solutions engineering efforts
            for a boutique software consultancy. Served as the technical face of the company for
            sales support and industry engagement.
          </RoleText>

          <RoleSection title="Engineering & Team Building">
            <ul>
              <Bullet>
                Designed and scaled cross-functional teams that could take on any project and
                deliver on time, on budget, with high quality
              </Bullet>
              <Bullet>Grew the overall organization by more than 2x</Bullet>
              <Bullet>
                Created the engineering career ladder, interview process, and performance management
                approach
              </Bullet>
              <Bullet>Directly mentored ~50 developers over the course of my tenure</Bullet>
            </ul>
          </RoleSection>

          <RoleSection title="Technical Leadership">
            <ul>
              <Bullet>Led R&D and established technical standards across all teams</Bullet>
              <Bullet>
                Drove major technology transitions while staying hands-on — architecture, code
                review, and jumping into the codebase alongside teams when projects called for it
              </Bullet>
              <Bullet>
                Led engagements ranging from greenfield builds to rescues where our team was brought
                in after others had failed — modernizing legacy medical software, shipping an MVP in
                3 months to satisfy board requirements, and taking over product and development for
                a connected fitness device
              </Bullet>
              <Bullet>
                Created and maintained open source frameworks; founded the Pittsburgh React meetup
              </Bullet>
              <Bullet>
                Represented the company as a speaker at CodeMash, ThatConference, StirTrek, and
                other regional tech events — on topics ranging from React Native to leadership to
                value-based pricing
              </Bullet>
            </ul>
          </RoleSection>

          <RoleSection title="Results">
            <ul>
              <Bullet>Company recognized as Greater Pittsburgh Top Workplace (2017, 2019)</Bullet>
              <Bullet>
                Guided teams to deliver 150+ projects across regulated and unregulated industries —
                healthcare, finance, sports, fitness, gaming, and connected hardware
              </Bullet>
              <Bullet>
                Built a team culture that alumni consistently describe as the best place they ever
                worked
              </Bullet>
            </ul>
          </RoleSection>
        </Role>

        <Role
          title="Director of Engineering"
          tenure="August 2013 – June 2015"
          location="Pittsburgh, PA"
        >
          <RoleText>
            Saw an organizational need and stepped up to fill it. Created the Director of
            Engineering role to bridge technical leadership with business operations — then built
            the systems to make it work.
          </RoleText>

          <RoleSection title="Operational Foundation">
            <ul>
              <Bullet>
                Established the structure for projecting capacity, forecasting revenue, and
                measuring value delivered. This foundation drove the business for the next decade.
              </Bullet>
              <Bullet>
                Standardized estimation and transitioned from hourly billing to value-based pricing
              </Bullet>
              <Bullet>
                Established job roles and performance management to give the engineering
                organization structure to scale
              </Bullet>
            </ul>
          </RoleSection>

          <RoleSection title="Team Building & Transition">
            <ul>
              <Bullet>
                Took over hiring and direct management of engineering, QA, and related roles
              </Bullet>
              <Bullet>Helped legacy developers transition to modern tech stacks</Bullet>
              <Bullet>
                Partnered with a colleague (now my ForceBuilders co-founder) to transition from a
                "bench" model to dedicated cross-functional teams — establishing product owner, QA,
                and design practices as part of the new structure
              </Bullet>
            </ul>
          </RoleSection>
        </Role>

        <Role title="Software Architect" tenure="May 2008 – August 2013" location="Pittsburgh, PA">
          <RoleText>
            Led architecture and delivery across multiple simultaneous custom software projects.
            Served as technical lead, client liaison, and hands-on developer.
          </RoleText>
          <ul>
            <Bullet>
              Built a restaurant POS system from scratch, leading a small team. Shipped to a live
              restaurant in 6 months; grew to nationwide roll out.
            </Bullet>
            <Bullet>
              Recognized early that mobile would transform the industry. Founded Truefit's mobile
              development practice — starting as the sole developer, growing to a small agile team.
            </Bullet>
            <Bullet>
              Rapidly delivered quality projects spanning web, mobile, and desktop — serving as both
              lead and developer while establishing frameworks and architecture patterns that
              enabled the team to move fast.
            </Bullet>
          </ul>
        </Role>

        <Role
          title="Senior Software Engineer / Software Engineer"
          tenure="May 2003 – May 2008"
          location="Pittsburgh, PA"
        >
          <RoleText>
            Started at Truefit out of college and quickly established myself as a technical leader.
          </RoleText>
          <ul>
            <Bullet>
              Led development on a proprietary SOA bus for a multi-product ERP system requiring
              real-time sync and third-party integrations.
            </Bullet>
            <Bullet>
              Re-architected the syncing system from a single-process to a distributed,
              multi-worker, job-based architecture.
            </Bullet>
            <Bullet>
              Designed and built an archive-and-purge utility for large databases with natural key
              constraints.
            </Bullet>
          </ul>
        </Role>
      </Company>

      <Company name="Grove City College" link="https://www.gcc.edu">
        <Role title="Adjunct Professor" tenure="May 2009 – May 2013" location="Grove City, PA">
          <ul>
            <Bullet>
              Developed and taught senior-level mobile development course (iOS/Objective-C)
            </Bullet>
            <Bullet>
              Mentored students on software engineering practices and career development
            </Bullet>
          </ul>
        </Role>
      </Company>
    </div>
  );
}
