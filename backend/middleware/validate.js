import { validationResult } from 'express-validator';

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map(err => ({ field: err.param, message: err.msg }))
    });
  }

  next(); // No errors, go ahead
};

export default validate;