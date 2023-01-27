import { Router } from 'express';
import auth from '../middleware/auth';
import { createProperty, properties } from '../controller/property';

const router = Router();

router.get('/property', properties);

router.post('/property', auth, createProperty);

export default router;
