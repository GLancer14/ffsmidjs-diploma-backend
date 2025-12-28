import Joi from "joi";

export const idValidationSchema = Joi.object().keys({
  id: Joi.number().required(),
});