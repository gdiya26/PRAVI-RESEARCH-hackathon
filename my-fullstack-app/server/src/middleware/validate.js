const ApiError = require('../utils/ApiError');

/**
 * Validate that required fields are present in req.body
 * @param {string[]} fields
 */
const requireFields = (fields = []) => {
  return (req, res, next) => {
    const missing = fields.filter((f) => {
      const val = req.body[f];
      return val === undefined || val === null || val === '';
    });

    if (missing.length > 0) {
      return next(new ApiError(400, `Missing required field(s): ${missing.join(', ')}`));
    }
    next();
  };
};

/**
 * Validate field value against allowed enum array
 * @param {string} field
 * @param {Array} allowedValues
 */
const validateEnum = (field, allowedValues = []) => {
  return (req, res, next) => {
    const value = req.body[field];
    if (value && !allowedValues.includes(value)) {
      return next(
        new ApiError(
          400,
          `Invalid value '${value}' for '${field}'. Allowed: ${allowedValues.join(', ')}`
        )
      );
    }
    next();
  };
};

module.exports = {
  requireFields,
  validateEnum
};
