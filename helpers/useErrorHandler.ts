import { NextFunction, Request, Response } from 'express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const asyncHandler = require('express-async-handler');

const useErrorHandler = (
  handler: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response<unknown, Record<string, unknown>> | undefined>
) =>
  asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
      try {
        return await handler(req, res, next);
      } catch (err: Error | any) {
        if (err.isJoi)
          return res.status(422).json({ message: err.details[0].message });
        return res.status(404).json({ message: err.message });
      }
    }
  );

export default useErrorHandler;
