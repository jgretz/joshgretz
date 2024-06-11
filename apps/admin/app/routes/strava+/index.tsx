import {Link} from '@remix-run/react';

export default function Strava() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/strava/connect">Connect To Strava</Link>
        </li>
        <li>
          <Link to="/strava/import-activities">Import Activities</Link>
        </li>
      </ul>
    </div>
  );
}
