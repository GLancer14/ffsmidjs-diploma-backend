import Joi from "joi";

export const loginUserValidationSchema = Joi.object().keys({
  email: Joi.string().email().required().messages({
    "any.required": "Почта не может быть пустой"
  }),
  password: Joi.string().required(),
});

export const createUserValidationSchema = Joi.object().keys({
  email: Joi.string().email().required().messages({
    "any.required": "Почта не может быть пустой"
  }),
  password: Joi.string().required(),
  name: Joi.string().required(),
  contactPhone: Joi.string().optional().empty(""),
  role: Joi.string().required(),
});

export const updateUserValidationSchema = Joi.object().keys({
  email: Joi.string().email().optional().empty(""),
  password: Joi.string().optional().empty(""),
  name: Joi.string().optional().empty(""),
  contactPhone: Joi.string().optional().empty(""),
  role: Joi.string().optional().empty(""),
});

export const updateAnotherUserValidationSchema = Joi.object().keys({
  id: Joi.number().required(),
  email: Joi.string().email().optional().empty(""),
  password: Joi.string().optional().empty(""),
  name: Joi.string().optional().empty(""),
  contactPhone: Joi.string().optional().empty(""),
  role: Joi.string().optional().empty(""),
});

export const findUserValidationSchema = Joi.object().keys({
  limit: Joi.number().optional(),
  offset: Joi.number().optional(),
  searchString: Joi.string().optional().empty(""),
  // email: Joi.string().optional().empty(""),
  // name: Joi.string().optional().empty(""),
  // contactPhone: Joi.string().optional().empty(""),
});

export const getUsersCountValidationSchema = Joi.object().keys({
  searchString: Joi.string().optional().empty(""),
  // email: Joi.string().optional().empty(""),
  // name: Joi.string().optional().empty(""),
  // contactPhone: Joi.string().optional().empty(""),
});