import Joi from 'joi';
import validateSchema from '../helpers/validateSchema';

export const validateLogin = (user) => {
  const schema = {
    email: Joi.string().trim().lowercase().min(5)
      .max(255)
      .email()
      .required(),
    password: Joi.string().trim().min(5).max(255)
      .required()
  };

  return validateSchema(user, schema);
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

  return validateSchema(user, schema);
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

export const validateArticle = (article) => {
  const schema = {
    title: Joi.string().trim().min(4)
      .max(500)
      .required(),
    body: Joi.string().trim().min(4)
      .required(),
    image: Joi.string().trim().optional()
  };
  return Joi.validate(article, schema, {
    language: {
      key: '{{key}} '
    },
    abortEarly: false,
    stripUnknown: true
  });
};
