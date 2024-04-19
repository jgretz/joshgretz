import MenuItem from '~/components/menu/menuItem.tsx';

export default function Menu() {
  return (
    <div className="flex w-full flex-col items-center">
      <ul className="flex flex-row justify-center">
        <MenuItem to="/running/stats">Stats</MenuItem>
        <MenuItem to="/running/maps">Maps</MenuItem>
        <MenuItem to="/running/schedule">Schedule</MenuItem>
      </ul>
      <div className="mb-1 w-5/6 border-b border-dashed border-primary" />
    </div>
  );
}
