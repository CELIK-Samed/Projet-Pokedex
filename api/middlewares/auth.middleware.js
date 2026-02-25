import Joi from 'joi';
import { checkBody } from "../utils/common.util.js";

export async function validateAuthRegister(req, res, next) {
    const authSchema = Joi.object({
        username: Joi.string().min(2).max(255).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(255).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    })
    checkBody(authSchema, req.body, res, next);
} 

export async function validateAuthLogin(req, res, next) {
    const authSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(255).required()
    })
    checkBody(authSchema, req.body, res, next);
}