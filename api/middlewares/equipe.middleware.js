import Joi from "joi";

export function validateEquipe(req, res, next) {
    const createEquipeSchema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().allow('', null)
    });
    const validation = createEquipeSchema.validate(req.body);
    if (validation.error) {
        return res.status(400).json(validation.error);
    }
    next();
}

export function validateEquipeUpdate(req, res, next) {
    const updateEquipeSchema = Joi.object({
        name: Joi.string(),
        description: Joi.string().allow('', null)
    });
    const validation = updateEquipeSchema.validate(req.body);
    if (validation.error) {
        return res.status(400).json(validation.error);
    }
    next();
}