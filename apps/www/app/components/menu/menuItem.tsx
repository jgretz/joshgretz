import { Link, useMatch } from "@remix-run/react";
import { cn } from "@www/lib/styles";

interface MenuItemProps {
	to: string;
	children: React.ReactNode;
}

export default function MenuItem({ to, children }: MenuItemProps) {
	const match = useMatch(to);
	const classNames = cn("mx-2 my-1", match ? "font-bold text-primary" : "");

	return (
		<li className={classNames}>
			<Link to={to}>{children}</Link>
		</li>
	);
}
