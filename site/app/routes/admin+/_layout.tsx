import {Outlet, useLoaderData} from '@remix-run/react';
import Menu from './_components/menu';
import Page from '~/components/page';
import {LoaderFunctionArgs} from '@remix-run/node';
import {getUser} from './_services/getUser';
import Login from './_components/login';

export async function loader({request}: LoaderFunctionArgs) {
  const user = await getUser(request);

  return {
    user,
  };
}

export default function Layout() {
  const {user} = useLoaderData<typeof loader>();

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
