import Joi from "joi";

export const registerValidationSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
  name: Joi.string().min(4).required(),
  contactPhone: Joi.string().min(4).optional(),
});
