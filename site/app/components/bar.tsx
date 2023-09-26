import Card from './card';
import Menu from './menu';

export default function Bar() {
  return (
    <div className="bg-cardbg flex flex-col items-center justify-center z-10 absolute sm:fixed top-0 left-0 w-full border-b border-accent sm:border-r sm:w-[200px] sm:h-full sm:border-b-0">
      <Card />
      <div className="border-dashed border-b border-white w-5/6 mb-1" />
      <Menu />
    </div>
  );
}
