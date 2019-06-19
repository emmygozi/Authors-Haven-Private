import Joi from 'joi';

const validateComment = (comment) => {
  const schema = {
    comment: Joi.string().trim().min(5)
      .max(500)
      .required()
  };

  return Joi.validate(comment, schema, {
    language: {
      key: '{{key}}'
    },
    abortEarly: false,
    stripUnknown: true
  });
};

export default validateComment;
