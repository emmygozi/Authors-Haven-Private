import Joi from 'joi';

export const validateProfileDetails = (profile) => {
  const schema = {
    firstname: Joi.string().trim().lowercase().min(4)
      .max(100)
      .optional()
      .alphanum(),
    lastname: Joi.string().trim().lowercase().min(5)
      .max(255)
      .optional(),
    bio: Joi.string().trim().min(5)
      .max(510)
      .optional(),
    avatar: Joi.string().trim().optional(),
    phoneNo: Joi.number().max(14).optional(),
    location: Joi.string().trim().optional()
  };
  return Joi.validate(profile, schema, {
    language: {
      key: '{{key}} '
    },
    abortEarly: false,
    stripUnknown: true
  });
};

export const abc = () => {};
