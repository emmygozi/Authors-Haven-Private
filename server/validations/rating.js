import Joi from 'joi';
import validateSchema from '../helpers/validateSchema';

const validateRatings = (rate) => {
  const schema = {
    rate: Joi.number()
      .valid(1, 2, 3, 4, 5)
      .required()
  };

  return validateSchema(rate, schema);
};

export default validateRatings;
