import Menu from '../menu/menu';
import Card from './card';

export default function Bar() {
  return (
    <div className="bg-cardbg flex flex-col items-center justify-center border-b border-accent sm:h-full sm:border-b-0 sm:border-r">
      <Card />
      <div className="mb-1 w-5/6 border-b border-dashed border-white" />
      <Menu />
    </div>
  );
}
