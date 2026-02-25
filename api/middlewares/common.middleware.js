import 'dotenv/config';
import * as fs from 'node:fs';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';


export function validateId(req, res, next) {
        const id = parseInt(req.params.id);
    if (!Number.isInteger(id)) {
        return res.status(400).json({
            error: "Invalid Id"
        })
    }
    // on passe la main à la suite
    next();
}

// Middleware d'erreur pour gerer les 500 generique
export function errorHandler(error, req, res, next) {
    let messageContent = {
        error: true,
        message: error.message,
        details: error.stack
    }
    if (process.env.NODE_ENV === 'prod') {
        const errorContent = (new Date).toISOString() + " : " + JSON.stringify(messageContent) + "\n";

        fs.appendFile('./logs/log', errorContent, err => {
            if (err) {
                console.error(err);
            } else {
                // file written successfully
            }
        });
        messageContent = {
            message: 'The API has crashed, try again'
        }
    }
    res.status(500).json(messageContent);
    next();
}

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  // Si le token n'existe pas ou ne commence pas par Bearer
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "No token found" });
  }

  // On récupère uniquement le token sans Bearer
  const token = authHeader.split(' ')[1];

  try {
    // On vérifie que le token est valide et que sa date d'expiration n'est pas passée
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // On ajoute l'utilisateur connecté dans la requête
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "invalid or expired token" });
  }
}