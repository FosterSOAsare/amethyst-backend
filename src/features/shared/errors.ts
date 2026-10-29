import type { ZodError } from "zod";

/** An error that already knows which HTTP status the API should respond with. */
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

/** Turns a Zod validation error into a readable response body. */
export function validationErrorBody(error: ZodError) {
  return {
    message: error.issues.map((issue) => issue.message).join(", "),
    errors: error.issues,
  };
}
