import { type HasChildrenProps } from "@www/Types";

export function Section({ children }: HasChildrenProps) {
	return (
		<div className="py-2 text-2xl font-bold uppercase text-primary">
			{children}
		</div>
	);
}
