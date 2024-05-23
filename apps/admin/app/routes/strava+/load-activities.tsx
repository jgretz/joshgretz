import {Button} from '@admin/components/ui/button';
import {DatePicker} from '@admin/components/ui/date-picker';
import loadActivities from '@admin/services/joshgretz-api/running/loadActivities';
import {useActionData, useLoaderData} from '@remix-run/react';
import type {ActionFunctionArgs, LoaderFunctionArgs} from '@remix-run/node';
import {getUser} from '@admin/services/auth/getUser';
import {useForm} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';
import {z} from 'zod';

const schema = z.object({
  user_id: z.number(),
  from: z.date(),
  to: z.date(),
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

  const {user_id, from, to} = submission.value;
  try {
    await loadActivities(user_id, from, to);
  } catch (error) {
    console.error(error);
    return submission.reply({
      formErrors: ['Failed to schedule loading of activities. Please try again.'],
    });
  }

  return submission;
}

export default function LoadSince() {
  const {user} = useLoaderData<typeof loader>();

  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,

    onValidate({formData}) {
      return parseWithZod(formData, {schema});
    },
  });

  return (
    <form method="post" id={form.id} onSubmit={form.onSubmit}>
      <input type="hidden" name={fields.user_id.name} value={user?.id} />

      <div>{form.errors}</div>
      <div>
        <label>Load Activites Range:</label>
        <DatePicker meta={fields.from} /> - <DatePicker meta={fields.to} />
      </div>
      <Button type="submit">Load Activities</Button>
    </form>
  );
}
