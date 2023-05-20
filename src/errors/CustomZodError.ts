import { ZodError, ZodIssueCode } from 'zod';

class CustomZodError extends ZodError {
  constructor(field: string, message: string) {
    super([{ code: ZodIssueCode.custom, path: [field], message }]);
  }
}

export default CustomZodError;
