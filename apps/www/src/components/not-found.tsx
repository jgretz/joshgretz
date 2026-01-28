import {Link} from '@tanstack/react-router';
import {LostRunner} from './illustrations/lost-runner';
import {Button} from './ui/button';

export const NotFound = () => {
  return (
    <main className="flex min-h-screen flex-1 items-center justify-center px-6 py-8 pt-28 text-center">
      <div className="max-w-xl">
        <LostRunner className="mx-auto mb-8 w-full max-w-md" />

        <h1 className="mb-2 font-hand text-7xl font-bold text-warm-400">404</h1>

        <h2 className="mb-4 font-serif text-2xl text-warm-800">This trail doesn't go anywhere</h2>

        <p className="mb-8 font-sans text-base leading-relaxed text-warm-700">
          You were bombing down the trail, headphones in, completely in the zone — and then the path
          just... stopped. No sign, no warning, just wilderness. That moment when momentum meets
          "wait, where am I?" Let's get you back to familiar ground.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link to="/">Head back home</Link>
          </Button>
          {/* <Button variant="outline" asChild>
            <Link to="/running">See where I actually run</Link>
          </Button> */}
        </div>
      </div>
    </main>
  );
};
