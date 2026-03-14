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


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API Sistema Rehabilitación funcionando" });
});

// 👇 MONTAR LAS RUTAS
app.use("/api/auth", authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/patologias', patologiaRoutes);
app.use('/api/ejercicios', ejercicioRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/rutinas', rutinaRoutes);
app.use('/api/cumplimiento', cumplimientoRoutes);
app.use('/api/fisioterapeuta', fisioterapeutaRoutes);




export default app;