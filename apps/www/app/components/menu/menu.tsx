import MenuItem from "./menuItem.tsx";

export default function Menu() {
	return (
		<ul className="flex w-2/3 flex-row items-center justify-center sm:flex-col">
			<MenuItem to="/">About</MenuItem>
			<MenuItem to="/resume">Resume</MenuItem>
			{/* <MenuItem to="/running">Running</MenuItem> */}
			{/* <MenuItem to="/thoughts">Thoughts</MenuItem> */}
		</ul>
	);
}
