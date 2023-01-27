import { v4 as uuidv4 } from 'uuid';
import { PropertyType } from '@prisma/client';
import prisma from '../../prisma';
import uploadFile from '../../middleware/uploadFile';
import useErrorHandler from '../../helpers/useErrorHandler';
import propertySchema from '../../helpers/schema/propertySchema';

export const properties = useErrorHandler(async (req, res) => {
  const { size, type, search } = req.query;

  let query = {};

  if (type) query = Object.assign({ type: type as PropertyType }, query);

  if (search)
    query = Object.assign({ address: { search: `${search}*` } }, query);

  const properties = await prisma.property.findMany({
    where: query,
    take: Number(size ?? 10),
  });

  return res
    .status(200)
    .json({ message: 'Properties fetched successfully', data: properties });
});

export const createProperty = useErrorHandler(async (req, res) => {
  const { id: authId } = res.locals.auth;

  const { address, description, price, type, published, availability, area } =
    req.body;

  await propertySchema.validateAsync(req.body);

  const { id: propertyId } = await prisma.property.create({
    data: {
      address,
      description,
      price,
      type,
      published,
      availability,
      area,
      user: {
        connect: {
          id: authId,
        },
      },
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
      `blogs/${filename}`
    );

    await prisma.property.update({
      where: {
        id: propertyId,
      },
      data: {
        image: fileUrl,
        imageName: filename,
      },
    });
  }

  return res.status(200).json({ message: 'Blog Posted Successfully' });
});
