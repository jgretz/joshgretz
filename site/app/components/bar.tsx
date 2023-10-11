import Card from './card';
import Menu from './menu';

export default function Bar() {
  return (
    <div className="bg-cardbg flex flex-col items-center justify-center border-b border-accent sm:border-r sm:border-b-0 sm:h-full">
      <Card />
      <div className="border-dashed border-b border-white w-5/6 mb-1" />
      <Menu />
    </div>
  );
}
