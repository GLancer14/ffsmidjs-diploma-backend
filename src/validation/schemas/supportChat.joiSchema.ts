import Joi from "joi";

export const sendMessageValidationSchema = Joi.object().keys({
  text: Joi.string().min(10).max(255).required(),
});

export const supportSearchParamsValidationSchema = Joi.object().keys({
  limit: Joi.number().optional(),
  offset: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

export const markAsReadValidationSchema = Joi.object().keys({
  createdBefore: Joi.date().required(),
});