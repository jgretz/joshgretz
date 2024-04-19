import MenuItem from '~/components/menu/menuItem.tsx';

export default function Menu() {
  return (
    <div className="flex w-full flex-col items-center">
      <ul>
        <MenuItem to="/admin/strava">Strava</MenuItem>
      </ul>
      <div className="mb-1 w-5/6 border-b border-dashed border-white" />
    </div>
  );
}
