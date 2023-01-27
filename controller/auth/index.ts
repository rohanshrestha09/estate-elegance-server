import { v4 as uuidv4 } from 'uuid';
import prisma from '../../prisma';
import deleteFile from '../../middleware/deleteFile';
import uploadFile from '../../middleware/uploadFile';
import useErrorHandler from '../../helpers/useErrorHandler';

export const authHandler = useErrorHandler(async (_req, res) => {
  return res
    .status(200)
    .json({ data: res.locals.auth, message: 'Authentication Success' });
});

export const updateName = useErrorHandler(async (req, res) => {
  const { id: authId } = res.locals.auth;

  const { name } = req.body;

  await prisma.user.update({ where: { id: authId }, data: { name } });

  return res.status(200).json({ message: 'Profile Updated Successfully' });
});

export const updateImage = useErrorHandler(async (req, res) => {
  const { id: authId, image, imageName } = res.locals.auth;

  if (req.files) {
    const file = req.files.image as any;

    if (!file.mimetype.startsWith('image/'))
      return res.status(403).json({ message: 'Please choose an image' });

    if (image && imageName) deleteFile(`users/${imageName}`);

    const filename = file.mimetype.replace('image/', `${uuidv4()}.`);

    const fileUrl = await uploadFile(
      file.data,
      file.mimetype,
      `users/${filename}`
    );

    await prisma.user.update({
      where: { id: authId },
      data: {
        image: fileUrl,
        imageName: filename,
      },
    });
  }

  return res.status(200).json({ message: 'Profile Updated Successfully' });
});
