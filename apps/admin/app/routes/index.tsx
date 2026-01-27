import {title} from '@admin/config.shared';
import type {MetaFunction} from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [{title: title()}, {name: 'description', content: 'Josh Gretz'}];
};

export default function Index() {
  return <main className="container prose py-8">Dashboard (Eventually :))</main>;
}
