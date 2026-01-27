import { Link } from '@tanstack/react-router';

export const NotFound = () => {
  return (
    <div className="container prose py-8">
      <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
      <p className="text-2xl mb-2">This is not the page you are looking for.</p>
      <p className="text-muted-foreground italic mb-8">Move along... move along.</p>
      <Link to="/" className="text-primary hover:underline">
        ← Go Home
      </Link>
    </div>
  );
};
