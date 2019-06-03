import Joi from 'joi';

export const validateLogin = (user) => {
  const schema = {
    email: Joi.string().trim().lowercase().min(5)
      .max(255)
      .email()
      .required(),
    password: Joi.string().trim().min(5).max(255)
      .required()
  };
  return Joi.validate(user, schema, {
    language: {
      key: '{{key}} '
    },
    abortEarly: false,
    stripUnknown: true
  });
};

export const validateSignup = (user) => {
  const schema = {
    username: Joi.string().trim().lowercase().min(4)
      .max(100)
      .required()
      .alphanum(),
    email: Joi.string().trim().lowercase().min(5)
      .max(255)
      .email()
      .required(),
    password: Joi.string().trim().min(5).max(255)
      .required()
  };
  return Joi.validate(user, schema, {
    language: {
      key: '{{key}} '
    },
    abortEarly: false,
    stripUnknown: true
  });
};

export const updateDetails = (user) => {
  const schema = {
    username: Joi.string().trim().lowercase().min(4)
      .max(100)
      .optional()
      .alphanum(),
    email: Joi.string().trim().lowercase().min(5)
      .max(255)
      .email()
      .optional(),
    bio: Joi.string().trim().min(5).max(500)
      .optional(),
    image: Joi.string().trim().optional(),
    password: Joi.string().trim().min(5).max(255)
      .optional()
  };
  return Joi.validate(user, schema, {
    language: {
      key: '{{key}} '
    },
    abortEarly: false,
    stripUnknown: true
  });
};
