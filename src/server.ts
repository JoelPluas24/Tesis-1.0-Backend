import app from "./app.js";
import dotenv from "dotenv";
import { seedDatabase } from "./config/seed.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Ejecutar inicialización de la base de datos
seedDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  });
});
