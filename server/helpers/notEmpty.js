/**
 * Function to check if value is empty
 * @param {string} value
 * @param {string} msg
 * @return {(error|bool)} returns error or true
 */
const notEmpty = (value, msg) => {
  if (value === '') {
    throw new Error(msg);
  }

  return true;
};

export default notEmpty;
