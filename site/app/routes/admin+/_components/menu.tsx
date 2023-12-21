import MenuItem from '~/components/menuItem';

export default function Menu() {
  return (
    <div className="flex flex-col items-center w-full">
      <ul>
        <MenuItem to="/admin/strava">Strava</MenuItem>
      </ul>
      <div className="border-dashed border-b border-white w-5/6 mb-1" />
    </div>
  );
}
