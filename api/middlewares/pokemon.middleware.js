import Joi from "joi";

export function validatePokemon(req, res, next) {
    const createPokemonSchema = Joi.object({
        name: Joi.string().required(),
        hp: Joi.number().integer().min(1).required(),
        atk: Joi.number().integer().min(1).required(),
        def: Joi.number().integer().min(1).required(),
        atk_spe: Joi.number().integer().min(1).required(),
        def_spe: Joi.number().integer().min(1).required(),
        speed: Joi.number().integer().min(1).required()
    });

    const validation = createPokemonSchema.validate(req.body);
    if (validation.error) {
        return res.status(400).json(validation.error);
    }
    next();
}

export function validatePokemonUpdate(req, res, next) {
    const updatePokemonSchema = Joi.object({
        name: Joi.string(),
        hp: Joi.number().integer().min(1),
        atk: Joi.number().integer().min(1),
        def: Joi.number().integer().min(1),
        atk_spe: Joi.number().integer().min(1),
        def_spe: Joi.number().integer().min(1),
        speed: Joi.number().integer().min(1)
    });

    const validation = updatePokemonSchema.validate(req.body);
    if (validation.error) {
        return res.status(400).json(validation.error);
    }
    next();
}