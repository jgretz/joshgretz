import { type Submission } from '@conform-to/react';
import { json } from '@remix-run/node';

import {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
  ValidationErrors,
} from '~/types/errors.ts';

export const GENERAL_VALIDATION_ERROR_FIELD = '';

export function handleDomainFormError(error: Error, submission: Submission) {
  let validationErrors: Record<string, string[]> = {};

  if (error instanceof ValidationErrors) {
    // if we have ValidationError, try to match it up with form fields, otherwise
    // return a general validation error
    validationErrors = error.errors.reduce<Record<string, string[]>>((acc, curr) => {
      const field =
        submission.payload && submission.payload[curr.path]
          ? curr.path
          : GENERAL_VALIDATION_ERROR_FIELD;

      acc[field] = [curr.message];

      return acc;
    }, {});
  }

  // Map any BadRequest errors to General Validation Errors when dealing with a form
  if (error instanceof BadRequestError) {
    validationErrors[GENERAL_VALIDATION_ERROR_FIELD] = [error.message];
  }

  if (Object.keys(validationErrors).length) {
    return json({
      ...submission,
      error: { ...submission.error, ...validationErrors },
    });
  }

  // otherwise handle all other errors via ErrorBoundary
  throw handleDomainError(error);
}

/**
 * Handles mapping of Err result type to Remix responses to streamline error handling by ErrorBoundaries
 * @param Err
 * @returns json error response
 * */
export function handleDomainError(error: Error) {
  console.error(error);

  let message = error.message;
  let status: 400 | 401 | 403 | 404 | 500 = 500;

  if (error instanceof BadRequestError) {
    status = 400;
  }

  if (error instanceof ValidationErrors) {
    status = 400;
    message = error.errors.map((x) => x.message).join(' ');
  }

  if (error instanceof UnauthorizedError) {
    status = 403;
  }

  if (error instanceof NotFoundError) {
    status = 404;
  }

  throw new Response(message, { status });
}
