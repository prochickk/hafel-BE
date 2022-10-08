const Joi = require("joi");

module.exports = schema => (req, res, next) => {
  // const result = schema.validate(req.body);
  const result = true

  if (result.error)
    return res.status(400).send({ error: result.error.details[0].message });

  next();
};
