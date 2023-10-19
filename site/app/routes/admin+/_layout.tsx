import {Outlet} from '@remix-run/react';
import Menu from './_components/menu';
import Page from '~/components/page';

export default function Layout() {
  return (
    <Page className="sm:justify-start">
      <Menu />
      <Outlet />
    </Page>
  );
}
