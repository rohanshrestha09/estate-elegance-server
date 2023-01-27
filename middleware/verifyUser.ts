import { Response, Request, NextFunction } from 'express';
import prisma from '../prisma';
import { exclude } from '../helpers/prisma';
import useErrorHandler from '../helpers/useErrorHandler';

export default useErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user: userId } = req.params || req.query;

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) return res.status(404).json({ message: 'User does not exist' });

    res.locals.user = exclude(user, ['password', 'email']);

    next();
  }
);
