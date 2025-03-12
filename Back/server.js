require('dotenv').config();
const express = require('express');
const mssql = require('mssql');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Configurar conexión a SQL Server
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

// Conectar a la base de datos
mssql.connect(dbConfig).then(pool => {
    if (pool.connected) {
        console.log('Conectado a la base de datos SQL Server');
    }
}).catch(err => console.error('Error de conexión:', err));

// Importar rutas
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/login');

app.use('/users', userRoutes);
app.use('/login', authRoutes);

// Documentación con Swagger
const swaggerPath = path.join(__dirname, 'swagger.json'); // 📌 Asegura que el archivo esté en la raíz
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

console.log('Swagger disponible en: http://localhost:3000/api-docs');

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
