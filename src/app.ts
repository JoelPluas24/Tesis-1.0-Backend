import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from './routes/admin.routes.js';
import userRoutes from './routes/users.routes.js';
import patologiaRoutes from './routes/patologia.routes.js'
import ejercicioRoutes from './routes/ejercicio.routes.js';
import pacienteRoutes from './routes/paciente.routes.js';
import rutinaRoutes from './routes/rutina.routes.js';
import cumplimientoRoutes from './routes/cumplimiento.routes.js'
import fisioterapeutaRoutes from './routes/fisioterapeuta.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { globalLimiter, authLimiter } from './middlewares/rateLimiter.js';

const app = express();

// Ocultar la cabecera X-Powered-By para evitar fingerprinting del servidor
app.disable('x-powered-by');

// Cabeceras de seguridad HTTP (Protección contra Clickjacking, MIME-Sniffing y XSS)
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Configuración de CORS más segura
const allowedOrigins = [
  'http://localhost:4200',
  process.env.CORS_ORIGIN
].filter(Boolean) as string[];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
// Límite estricto de tamaño de payload para prevenir ataques de Denegación de Servicio (DoS)
app.use(express.json({ limit: '50kb' }));

// Aplicar Rate Limiting global
app.use(globalLimiter);

app.get("/", (req, res) => {
  res.json({ message: "API Sistema Rehabilitación funcionando" });
});

// 👇 MONTAR LAS RUTAS
app.use("/api/auth", authLimiter, authRoutes); // Límite estricto para autenticación
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/patologias', patologiaRoutes);
app.use('/api/ejercicios', ejercicioRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/rutinas', rutinaRoutes);
app.use('/api/cumplimiento', cumplimientoRoutes);
app.use('/api/fisioterapeuta', fisioterapeutaRoutes);

// Manejo global de errores
app.use(errorHandler);

export default app;