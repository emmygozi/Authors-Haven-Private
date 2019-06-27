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

export const validatePasswordReset = (resetDetails) => {
  const schema = {
    password: Joi.string().trim().min(5).max(255)
      .required(),
    confirmPassword: Joi
      .valid(Joi.ref('password')).error(() => 'Passwords do not match')
      .required()
  };

  return validateSchema(resetDetails, schema);
};

export const validateForgotPassword = (user) => {
  const schema = {
    email: Joi.string().trim().lowercase().min(5)
      .max(255)
      .email()
      .required()
  };

  return validateSchema(user, schema);
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
