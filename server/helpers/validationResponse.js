export const validationResponse = error => error.details.reduce((result, currentValue) => {
  if (!Object.hasOwnProperty.call(result, currentValue.context.key)) {
    result[currentValue.context.key] = currentValue.message;
  }
  return result;
}, {});

export const validateUniqueResponse = error => error.errors.reduce((result, currentValue) => {
  if (currentValue.type === 'unique violation') {
    result[currentValue.path] = `${currentValue.path} has already been taken`;
  } else if (currentValue.path) {
    result[currentValue.path] = currentValue.message;
  } else {
    result.global = currentValue.message;
  }
  return result;
}, {});
