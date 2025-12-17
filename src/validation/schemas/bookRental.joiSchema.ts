import Joi from "joi";

export const rentBookValidationSchema = Joi.object().keys({
  libraryId: Joi.number().required(),
  bookId: Joi.number().required(),
  dateStart: Joi.string().min(4).required(),
  dateEnd: Joi.string().min(4).required(),
});
