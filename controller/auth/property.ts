import prisma from '../../prisma';
import useErrorHandler from '../../helpers/useErrorHandler';

export const authProperties = useErrorHandler(async (_req, res) => {
  const { id: authId } = res.locals.auth;

  const properties = await prisma.user.findUnique({
    where: {
      id: authId,
    },
    select: {
      properties: true,
    },
  });

  return res.status(200).json({
    message: 'Properties fetched successfully',
    data: properties,
  });
});
