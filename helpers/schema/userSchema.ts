import Joi from 'joi';
import { Role } from '@prisma/client';

const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .length(10)
    .pattern(/^977-98[0-9]+$/, 'numbers')
    .required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .label('Password does not match'),
  role: Joi.string().valid(Role).required(),
  image: Joi.string(),
  imageName: Joi.string(),
});

export default userSchema;
