import { Server } from 'socket.io';
import { logger } from '../utils/logger.js';

class SocketService {
  private io: Server | null = null;

  init(httpServer: any) {
    this.io = new Server(httpServer, {
      cors: {
        origin: '*', // En producción debería restringirse al dominio del frontend
        methods: ['GET', 'POST']
      }
    });

    this.io.on('connection', (socket) => {
      logger.info(`Nuevo cliente conectado: ${socket.id}`);

      // Unir al usuario a una sala con su ID para enviarle notificaciones privadas
      socket.on('registerUser', (userId: number) => {
        socket.join(`user_${userId}`);
        logger.info(`Socket ${socket.id} registrado para user_${userId}`);
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
