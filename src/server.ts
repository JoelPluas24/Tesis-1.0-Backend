import app from "./app.js";
import dotenv from "dotenv";
import { seedDatabase } from "./config/seed.js";
import { logger } from "./utils/logger.js";

import http from 'http';
import { socketService } from './services/socket.service.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Crear servidor HTTP a partir de la app de Express
const server = http.createServer(app);

// Inicializar Socket.io con el servidor HTTP
socketService.init(server);

// Ejecutar inicialización de la base de datos
seedDatabase().then(() => {
  server.listen(PORT, () => {
    logger.info(`Servidor HTTP y WebSockets corriendo en el puerto ${PORT}`);
  });
});
