import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';

class SocketService {
  private io: Server | null = null;

  init(httpServer: any) {
    const allowedOrigins = [
      'http://localhost:4200',
      process.env.CORS_ORIGIN
    ].filter(Boolean) as string[];

    this.io = new Server(httpServer, {
      cors: {
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
            callback(null, true);
          } else {
            callback(new Error('No permitido por CORS en WebSockets'));
          }
        },
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    // Middleware de autenticación JWT para WebSockets
    this.io.use((socket, next) => {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
      if (!token) {
        return next(new Error('Autenticación de WebSocket requerida'));
      }

      try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
        socket.data.user = decoded;
        next();
      } catch (err) {
        return next(new Error('Token de WebSocket inválido o expirado'));
      }
    });

    this.io.on('connection', (socket) => {
      const authenticatedUserId = socket.data.user?.id;
      logger.info(`Cliente autenticado conectado a WebSocket: ${socket.id} (user_${authenticatedUserId})`);

      if (authenticatedUserId) {
        socket.join(`user_${authenticatedUserId}`);
      }

      // Si el cliente emite registerUser, solo permitir su propio ID verificado por el token JWT
      socket.on('registerUser', () => {
        if (authenticatedUserId) {
          socket.join(`user_${authenticatedUserId}`);
          logger.info(`Socket ${socket.id} registrado de forma segura para user_${authenticatedUserId}`);
        }
      });

      socket.on('disconnect', () => {
        logger.info(`Cliente desconectado: ${socket.id}`);
      });
    });
  }

  getIO(): Server {
    if (!this.io) {
      throw new Error('Socket.io no está inicializado');
    }
    return this.io;
  }

  notifyUser(userId: number, event: string, data: any) {
    if (this.io) {
      this.io.to(`user_${userId}`).emit(event, data);
    }
  }
}

export const socketService = new SocketService();
