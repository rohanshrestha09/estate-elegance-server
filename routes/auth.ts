import { Router } from 'express';
import auth from '../middleware/auth';
import { authHandler, updateImage, updateName } from '../controller/auth';
import { authProperties } from '../controller/auth/property';

const router = Router();

router.use(['/auth'], auth);

router.get('/auth', authHandler);

router.put('/auth/name', updateName);

router.put('/auth/image', updateImage);

router.get('/auth/property', authProperties);

export default router;
