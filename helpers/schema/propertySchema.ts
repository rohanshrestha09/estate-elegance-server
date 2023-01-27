import Joi from "joi";
import { PropertyType } from "@prisma/client";

const propertySchema = Joi.object({
  address: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  area: Joi.number().required(),
  image: Joi.string(),
  imageName: Joi.string(),
  type: Joi.string().valid(PropertyType).required(),
  published: Joi.boolean(),
  availability: Joi.boolean(),
});

export default propertySchema;
