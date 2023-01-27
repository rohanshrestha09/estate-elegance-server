import prisma from '../../prisma';
import bcrypt from 'bcryptjs';
import { sign, Secret } from 'jsonwebtoken';
import { serialize } from 'cookie';
import { v4 as uuidv4 } from 'uuid';
import uploadFile from '../../middleware/uploadFile';
import userSchema from '../../helpers/schema/userSchema';
import useErrorHandler from '../../helpers/useErrorHandler';

export const register = useErrorHandler(async (req, res) => {
  const { name, email, role, phone, password } = req.body;

  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists)
    return res
      .status(403)
      .json({ message: 'User already exists. Choose a different email.' });

  await userSchema.validateAsync(req.body);

  const salt = await bcrypt.genSalt(10);

  const encryptedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      phone,
      password: encryptedPassword,
      role,
    },
  });

  if (req.files) {
    const file = req.files.image as any;

    if (!file.mimetype.startsWith('image/'))
      return res.status(403).json({ message: 'Please choose an image' });

    const filename = file.mimetype.replace('image/', `${uuidv4()}.`);

    const fileUrl = await uploadFile(
      file.data,
      file.mimetype,
      `users/${filename}`
    );

    await prisma.user.update({
      where: { email: user.email },
      data: {
        image: fileUrl,
        imageName: filename,
      },
    });
  }

  const token = sign({ email: user.email }, process.env.JWT_TOKEN as Secret, {
    expiresIn: '30d',
  });

  const serialized = serialize('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });

  res.setHeader('Set-Cookie', serialized);

  return res.status(200).json({ token, message: 'Signup Successful' });
});

export const login = useErrorHandler(async (req, res) => {
  const { email, phone, password } = req.body;

  const user = await prisma.user.findFirst({
    where: { OR: [{ email }, { phone: Number(phone) }] },
    select: { email: true, password: true },
  });

  if (!user) return res.status(404).json({ message: 'User does not exist.' });

  const isMatched = await bcrypt.compare(password, user.password);

  if (!isMatched)
    return res.status(403).json({ message: 'Incorrect Password' });

  const token = sign({ email: user.email }, process.env.JWT_TOKEN as Secret, {
    expiresIn: '30d',
  });

  const serialized = serialize('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });

  res.setHeader('Set-Cookie', serialized);

  return res.status(200).json({ token, message: 'Login Successful' });
});

export const user = useErrorHandler(async (_req, res) => {
  return res.status(200).json({
    data: res.locals.user,
    message: 'User Fetched Successfully',
  });
});
