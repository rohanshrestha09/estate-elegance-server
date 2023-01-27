import { Response, Request, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../prisma';
import useErrorHandler from '../helpers/useErrorHandler';

export default useErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: authId } = res.locals.auth;

    const { password } = req.body;

    if (!password)
      return res.status(403).json({ message: 'Please input password' });

    const auth = await prisma.user.findUnique({
      where: { id: authId },
      select: { password: true },
    });

    if (!auth) return res.status(404).json({ message: 'User does not exist' });

    const isMatched: boolean = await bcrypt.compare(password, auth.password);

    if (!isMatched)
      return res.status(403).json({ message: 'Incorrect Password' });

    next();
  }
);
