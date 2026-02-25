import cors from 'cors';
import { xss } from 'express-xss-sanitizer';
import 'dotenv/config';
import express from 'express';
import pokemonRoutes from './routes/pokemon.routes.js';
import equipeRoutes from './routes/equipe.routes.js';
import typeRoutes from './routes/type.routes.js';
import authRoutes from './routes/auth.routes.js';
import { authenticate, errorHandler } from './middlewares/common.middleware.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(join(__dirname, '../client/dist')));

app.use(cors());

app.use(xss());


//app.use(authenticate);

app.use('/api/auth', authRoutes);
app.use('/api/equipes', equipeRoutes);
app.use('/api/pokemons', pokemonRoutes);
app.use('/api/types', typeRoutes);


app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur tourne sur http://0.0.0.0:${PORT}`);
});
