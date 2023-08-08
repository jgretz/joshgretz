import type {V2_MetaFunction} from '@remix-run/node';

export const meta: V2_MetaFunction = () => {
  return [{title: 'JoshGretz.io'}, {name: 'description', content: ''}];
};

export default function Index() {
  return <div className="h-full w-full">Josh Gretz.io</div>;
}
