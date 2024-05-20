import {Button} from '@admin/components/ui/button';
import {DatePicker} from '@admin/components/ui/date-picker';
import loadActivitiesSince from '@admin/services/joshgretz-api/running/loadActivitiesSince';
import {useActionData, useLoaderData} from '@remix-run/react';
import {useState} from 'react';
import {formatISO} from 'date-fns';
import type {ActionFunctionArgs, LoaderFunctionArgs} from '@remix-run/node';
import {getUser} from '@admin/services/auth/getUser';
import {useForm} from '@conform-to/react';
import {getZodConstraint, parseWithZod} from '@conform-to/zod';
import {z} from 'zod';

const schema = z.object({
  user_id: z.number(),
  date: z.date(),
});

export async function loader({request}: LoaderFunctionArgs) {
  const user = await getUser(request);

  return {
    user,
  };
}

export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, {schema});

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const {user_id, date} = submission.value;
  try {
    await loadActivitiesSince(user_id, date);
  } catch (error) {
    console.error(error);
    return submission.reply({
      formErrors: ['Failed to schedule loading of activities. Please try again.'],
    });
  }

  return submission.value;
}

export default function LoadSince() {
  const {user} = useLoaderData<typeof loader>();
  const [date, setDate] = useState<Date | undefined>(new Date());

  const [form, fields] = useForm({});

  return (
    <form method="post" id={form.id} onSubmit={form.onSubmit}>
      <input type="hidden" name={fields.user_id.name} value={user?.id} />
      <input type="hidden" name={fields.date.name} value={formatISO(date || new Date())} />

      <div>{form.errors}</div>
      <div>
        <label>Load Since Date:</label>
        <DatePicker date={date} setDate={setDate} />
      </div>
      <Button type="submit">Load Activities</Button>
    </form>
  );
}
