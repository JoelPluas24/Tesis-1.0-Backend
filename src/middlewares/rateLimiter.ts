import { rateLimit } from 'express-rate-limit';

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // Límite de 200 peticiones por ventana por IP
  message: { message: 'Demasiadas solicitudes desde esta IP, por favor intente de nuevo más tarde.' },
  standardHeaders: true, // Retorna info del límite en headers
  legacyHeaders: false, // Deshabilita los headers X-RateLimit-* antiguos
});

export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 15, // Límite de 15 intentos de login/registro/refresh por IP
  message: { message: 'Demasiados intentos de autenticación, por favor intente de nuevo en un minuto.' },
  standardHeaders: true,
  legacyHeaders: false,
});
