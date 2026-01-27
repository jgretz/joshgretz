import {
  ErrorComponent,
  type ErrorComponentProps,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from '@tanstack/react-router';

export const DefaultCatchBoundary = ({ error }: ErrorComponentProps) => {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });

  console.error(error);

  return (
    <div className="container prose py-8">
      <h1>500</h1>
      <p>An unexpected error occurred.</p>
      <div className="flex gap-4 mt-4">
        <button
          type="button"
          onClick={() => router.invalidate()}
          className="text-primary hover:underline"
        >
          Try Again
        </button>
        {isRoot ? (
          <Link to="/" className="text-primary hover:underline">
            ← Go Home
          </Link>
        ) : (
          <Link
            to="/"
            onClick={(e) => {
              e.preventDefault();
              window.history.back();
            }}
            className="text-primary hover:underline"
          >
            ← Go Back
          </Link>
        )}
      </div>
      <ErrorComponent error={error} />
    </div>
  );
};
