import { getActivities } from '~/domain/running/services/getActivities.service.ts';

export async function loader() {
  // const activities = await getActivities();

  // return { activities };

  return {};
}

export default function Maps() {
  return <div>Maps</div>;
}
