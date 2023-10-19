import {Form} from '@remix-run/react';
import {ROUTES} from './_constants/routes';

export default function Login() {
  return (
    <div className="flex justify-center mt-5 w-full ">
      <Form action={ROUTES.AUTH} method="post">
        <button>Login</button>
      </Form>
    </div>
  );
}
