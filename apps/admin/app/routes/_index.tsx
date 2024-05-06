import {title} from '@/config.shared';
import type {MetaFunction} from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [{title: title()}, {name: 'description', content: 'Josh Gretz - CTO, Runner, and Maker.'}];
};

export default function Index() {
  return <main className="container prose py-8"></main>;
}
