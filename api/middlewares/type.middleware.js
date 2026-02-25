import Joi from "joi";

export function validateType(req, res, next) {
  const createTypeSchema = Joi.object({
    name: Joi.string().required(),
    color: Joi.string().length(6).pattern(/^[0-9a-fA-F]{6}$/).required()
  });

  const validation = createTypeSchema.validate(req.body);
  if (validation.error) {
    return res.status(400).json(validation.error);
  }
  next();
}

export function validateTypeUpdate(req, res, next) {
  const updateTypeSchema = Joi.object({
    name: Joi.string(),
    color: Joi.string().length(6).pattern(/^[0-9a-fA-F]{6}$/)
  });

  const validation = updateTypeSchema.validate(req.body);
  if (validation.error) {
    return res.status(400).json(validation.error);
  }
  next();
}