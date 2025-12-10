import Joi from "joi";

export const createUserValidationSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  name: Joi.string().required(),
  contactPhone: Joi.string().optional(),
  role: Joi.string().required(),
});

export const findUserValidationSchema = Joi.object().keys({
  limit: Joi.number().optional(),
  offset: Joi.number().optional(),
  email: Joi.string().optional(),
  name: Joi.string().optional(),
  contactPhone: Joi.string().optional(),
});
