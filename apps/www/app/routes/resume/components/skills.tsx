import { Section } from "./section";

interface SkillCategoryProps {
	title: string;
	skills: string;
}

function SkillCategory({ title, skills }: SkillCategoryProps) {
	return (
		<div className="mb-3">
			<span className="font-semibold">{title}:</span>{" "}
			<span className="text-sm">{skills}</span>
		</div>
	);
}

export default function Skills() {
	return (
		<div>
			<Section>Skills</Section>
			<SkillCategory
				title="Engineering"
				skills="Node, React, React Native, TypeScript, Bun, .NET/C#, Objective-C, Swift, Java, BLE integration, AWS, Azure, Fly, Docker, Claude, GitHub Copilot"
			/>
			<SkillCategory
				title="Architecture"
				skills="System design, SDLC design, technical due diligence, capacity planning, SOA, distributed architecture"
			/>
			<SkillCategory
				title="Leadership & Organization"
				skills="Team building, hiring & interviewing, performance management, cross-functional team design, mentoring"
			/>
			<SkillCategory
				title="Communication"
				skills="Public speaking, solutions engineering, sales support"
			/>
		</div>
	);
}
