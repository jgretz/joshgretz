import { type LoaderFunctionArgs } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import Page from '~/components/page.tsx';
import Login from './_components/login.tsx';
import Menu from './_components/menu.tsx';
import { getUser } from './_services/getUser.ts';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);

  return {
    user,
  };
}

export default function Layout() {
  const { user } = useLoaderData<typeof loader>();

  const Content = user ? (
    <>
      <Menu />
      <Outlet />
    </>
  ) : (
    <>
      <Login />
    </>
  );

  return <Page className="sm:justify-start">{Content}</Page>;
}
