import Joi from 'joi';

const validateSchema = (payload, schema) => Joi.validate(payload, schema, {
  language: {
    key: '{{key}} '
  },
  abortEarly: false,
  stripUnknown: true
});

export default validateSchema;
