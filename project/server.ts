import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import replicateRoutes from './src/routes/replicate';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/replicate', replicateRoutes);

// Servir les fichiers statiques de la build React
app.use(express.static('dist'));

// Gérer toutes les autres routes en renvoyant l'index.html
app.get('*', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
