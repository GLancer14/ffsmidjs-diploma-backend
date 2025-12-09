import Joi from "joi";

export const getBooksValidationSchema = Joi.object().keys({
  library: Joi.number().required(),
  auhtor: Joi.string().min(3).optional(),
  title: Joi.string().min(4).optional(),
  availableOnly: Joi.boolean().optional(),
});

export const createLibraryValidationSchema = Joi.object().keys({
  name: Joi.string().required(),
  address: Joi.string().min(4).required(),
  description: Joi.string().min(4).optional(),
});

export const createBookValidationSchema = Joi.object().keys({
  libraryId: Joi.number().required(),
  title: Joi.string().min(4).required(),
  author: Joi.string().min(4).required(),
  year: Joi.number().optional(),
  description: Joi.string().min(4).optional(),
  totalCopies: Joi.number().optional(),
});

export const sendMessageValidationSchema = Joi.object().keys({
  text: Joi.string().min(10).max(255).required(),
});

export const supportSearchParamsValidationSchema = Joi.object().keys({
  limit: Joi.number().optional(),
  offset: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
})