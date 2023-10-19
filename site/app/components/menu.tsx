import MenuItem from './menuitem';

export default function Menu() {
  return (
    <ul className="w-2/3 flex flex-row sm:flex-col justify-center items-center">
      <MenuItem to="/">About</MenuItem>
      <MenuItem to="/resume">Resume</MenuItem>
      <MenuItem to="/running">Running</MenuItem>
      {/* <MenuItem to="/thoughts">Thoughts</MenuItem> */}
    </ul>
  );
}
