import { User } from '../models/user.model.js';
import { StatusCodes } from 'http-status-codes';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import "dotenv/config";

export async function registerUser(req, res) {
    try {
        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: await argon2.hash(req.body.password)
        });

        res.status(StatusCodes.CREATED).json({
            id: user.id,
            username: user.username,
            email: user.email
        });
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(StatusCodes.CONFLICT).json({ message: "Username already exists"});
        }
        next(error);
    }
}

export async function loginUser(req, res) {
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ 
                error: "Invalid email or password" 
            });
        }

    const token = jwt.sign(
      { user_id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(StatusCodes.OK).json({ token });

  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    const user = await User.findByPk(req.user.user_id, {
      attributes: ["id", "username", "email"]
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Utilisateur non trouvé"
      });
    }

    res.status(StatusCodes.OK).json(user);

  } catch (error) {
    next(error);
  }
}