export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Not Found';
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Unauthorized';
  }
}

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Bad Request';
  }
}

export class ValidationErrors extends Error {
  errors: {message: string; path: string}[];

  constructor(errors: {message: string; path: string}[]) {
    super(`${errors.length} errors`);
    this.message = 'One or more validation errors has occurred';
    this.errors = errors;
  }
}

export class ServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Internal Server Error';
  }
}
