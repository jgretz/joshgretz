import {Form} from '@remix-run/react';
import {ROUTES} from '../constants/routes';

export default function Login() {
  return (
    <div className="mt-5 flex w-full justify-center ">
      <Form action={ROUTES.AUTH} method="post">
        <button type="submit">Login</button>
      </Form>
    </div>
  );
}
