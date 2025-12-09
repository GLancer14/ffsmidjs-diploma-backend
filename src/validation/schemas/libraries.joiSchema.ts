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