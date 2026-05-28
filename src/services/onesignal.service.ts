import { logger } from '../utils/logger.js';

export class OneSignalService {
  private static APP_ID = process.env.ONESIGNAL_APP_ID || '';
  private static REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY || '';

  /**
   * Envía una notificación push a un usuario específico
   * @param externalUserId ID del usuario en nuestro sistema (ej. paciente_id o usuario_id)
   * @param titulo Título de la notificación
   * @param mensaje Cuerpo de la notificación
   */
  static async sendNotificationToUser(externalUserId: string, titulo: string, mensaje: string) {
    if (!this.APP_ID || !this.REST_API_KEY) {
      logger.warn('OneSignal no está configurado (faltan APP_ID o REST_API_KEY). Omitiendo notificación.');
      return;
    }

    try {
      const response = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': `Basic ${this.REST_API_KEY}`
        },
        body: JSON.stringify({
          app_id: this.APP_ID,
          include_external_user_ids: [externalUserId],
          headings: { en: titulo, es: titulo },
          contents: { en: mensaje, es: mensaje },
          channel_for_external_user_ids: 'push'
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        logger.info(`Notificación de OneSignal enviada a usuario ${externalUserId}: ${JSON.stringify(data)}`);
      } else {
        logger.error(`Error enviando notificación OneSignal: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      logger.error('Error de red al conectar con OneSignal:', error);
    }
  }
}
