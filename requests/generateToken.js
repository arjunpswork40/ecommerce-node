const Joi = require("joi");
const { parseMessages } = require("../requests/parseErrorMessages");

module.exports = {
  validateRequest: (reqBody) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      tries: Joi.number().min(1).max(100).required(),
    });
    const validationResult = schema.validate(reqBody, { abortEarly: false });
    if (validationResult.error) {
      const messages = parseMessages(validationResult.error);
      throw messages;
    }
  },
};
