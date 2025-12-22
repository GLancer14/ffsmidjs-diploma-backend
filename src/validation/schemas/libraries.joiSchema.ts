import Joi from "joi";

export const getBooksValidationSchema = Joi.object().keys({
  library: Joi.number().optional(),
  author: Joi.string().optional().empty(""),
  title: Joi.string().optional().empty(""),
  availableOnly: Joi.boolean().optional(),
});

export const createLibraryValidationSchema = Joi.object().keys({
  name: Joi.string().required(),
  address: Joi.string().min(4).required(),
  description: Joi.string().min(4).optional().empty(""),
});

export const createBookValidationSchema = Joi.object().keys({
  libraryId: Joi.number().required(),
  title: Joi.string().min(4).required(),
  author: Joi.string().min(4).required(),
  year: Joi.number().optional(),
  description: Joi.string().optional().empty(""),
  totalCopies: Joi.number().optional(),
  availableCopies: Joi.number().optional(),
});

export const findLibrariesValidationSchema = Joi.object().keys({
  limit: Joi.number().optional(),
  offset: Joi.number().optional(),
  searchString: Joi.string().optional().empty(""),
  // name: Joi.string().optional().empty(""),
  // address: Joi.string().min(4).optional().empty(""),
});