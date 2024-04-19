import {
  isRouteErrorResponse,
  useParams,
  useRouteError,
  type ErrorResponse,
} from '@remix-run/react';
import { captureRemixErrorBoundaryError } from '@sentry/remix';

import { getErrorMessage } from '~/utils/misc.ts';

type StatusHandler = (info: {
  error: ErrorResponse;
  params: Record<string, string | undefined>;
}) => JSX.Element | null;

type Props = {
  defaultStatusHandler?: StatusHandler;
  statusHandlers?: Record<number, StatusHandler>;
};

function UnexpectedErrorMessage({ error }: { error: unknown }) {
  return <p>{getErrorMessage(error)}</p>;
}

export function RouteErrorMessage({
  error,
  params,
  children,
}: {
  error: ErrorResponse;
  params: Record<string, string | undefined>;
  children?: React.ReactNode;
}) {
  return (
    <>
      <h1 className="text-8xl text-slate-600">{error.status}</h1>
      <p className="text-gray-600">
        <strong>{error.statusText.length ? error.statusText : 'Error'}:</strong> {error.data}
      </p>
      {children && <div>{children}</div>}
    </>
  );
}

export function GeneralErrorBoundary({
  defaultStatusHandler = RouteErrorMessage,
  statusHandlers,
}: Props) {
  const error = useRouteError();
  captureRemixErrorBoundaryError(error);
  const params = useParams();

  if (typeof document !== 'undefined') {
    console.error(error);
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-center gap-4 p-20">
      {isRouteErrorResponse(error) ? (
        (statusHandlers?.[error.status] ?? defaultStatusHandler)({
          error,
          params,
        })
      ) : (
        <UnexpectedErrorMessage error={error} />
      )}
    </div>
  );
}
