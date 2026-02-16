import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

interface ValidationTargets {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

/**
 * Express middleware that validates request body, query, and/or params against
 * Zod schemas. Returns 400 with structured error details on failure.
 */
export function validate(schemas: ValidationTargets) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: { field: string; message: string }[] = [];

    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
    } catch (err) {
      if (err instanceof ZodError) {
        errors.push(
          ...err.issues.map((issue) => ({
            field: `body.${issue.path.join('.')}`,
            message: issue.message,
          }))
        );
      }
    }

    try {
      if (schemas.query) {
        const parsed = schemas.query.parse(req.query);
        // Assign parsed values back to query so types are clean
        for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
          (req.query as Record<string, unknown>)[key] = value;
        }
      }
    } catch (err) {
      if (err instanceof ZodError) {
        errors.push(
          ...err.issues.map((issue) => ({
            field: `query.${issue.path.join('.')}`,
            message: issue.message,
          }))
        );
      }
    }

    try {
      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as typeof req.params;
      }
    } catch (err) {
      if (err instanceof ZodError) {
        errors.push(
          ...err.issues.map((issue) => ({
            field: `params.${issue.path.join('.')}`,
            message: issue.message,
          }))
        );
      }
    }

    if (errors.length > 0) {
      res.status(400).json({
        error: 'Validation failed',
        details: errors,
      });
      return;
    }

    next();
  };
}
