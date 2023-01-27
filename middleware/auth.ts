import { NextFunction, Request, Response } from 'express';
import { JwtPayload, Secret, verify } from 'jsonwebtoken';
import prisma from '../prisma';
import { exclude } from '../helpers/prisma';
import useErrorHandler from '../helpers/useErrorHandler';

export default useErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;

    if (!token) return res.status(401).json({ message: 'Not authorised' });

    const { email } = verify(
      token,
      process.env.JWT_TOKEN as Secret
    ) as JwtPayload;

    const auth = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!auth) return res.status(404).json({ message: 'User does not exist' });

    res.locals.auth = exclude(auth, ['password']);

    next();
  }
);
