import { Form } from '@remix-run/react';
import { ROUTES } from '../_constants/routes.ts';

export default function Login() {
  return (
    <div className="mt-5 flex w-full justify-center ">
      <Form action={ROUTES.AUTH} method="post">
        <button>Login</button>
      </Form>
    </div>
  );
}
