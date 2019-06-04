export const validationResponse = error => error.details.reduce((result, currentValue) => {
  if (!Object.hasOwnProperty.call(result, currentValue.context.key)) {
    result[currentValue.context.key] = currentValue.message;
  }
  return result;
}, {});

export const validateUniqueResponse = error => error.errors.reduce((result, currentValue) => {
  if (result.type === 'unique violation') {
    result[currentValue.path] = currentValue.message;
  } else {
    result.global = `${currentValue.path} has already been taken`;
  }
  return result;
}, {});
