import mssql from "mssql";
import { config } from "dotenv";

config(); // Cargar variables de entorno desde .env

// Configuración de conexión a SQL Server
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false,  // ❗ IMPORTANTE: En SQL Server Express, usa "false" para evitar errores de SSL
        trustServerCertificate: true
    }
};

// Función para conectar a la base de datos
export const connectDB = async () => {
    try {
        let pool = await mssql.connect(dbConfig);
        console.log("✅ Conectado a la base de datos SQL Server");
        return pool;
    } catch (error) {
        console.error("❌ Error de conexión a SQL Server:", error);
        throw error;
    }
};

export default dbConfig;
