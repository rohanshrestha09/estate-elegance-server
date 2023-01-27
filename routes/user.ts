import { Router } from 'express';
import verifyUser from '../middleware/verifyUser';
// import verifyEmail from "../middleware/verifyEmail";
import { login, register, user } from '../controller/user';

const router = Router();

router.param('user', verifyUser);

router.post('/user/register', register);

router.post('/user/login', login);

router.get('/user/:user', user);

export default router;
