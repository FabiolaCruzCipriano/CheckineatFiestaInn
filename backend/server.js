// server.js
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const sequelize = require('./config/database');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const administradorRoutes = require('./routes/administradorRoutes');
const empleadoRoutes = require('./routes/empleadoRoutes');
const registroRoutes = require('./routes/registroRoutes');
const departamentoRoutes = require('./routes/departamentoRoutes');
const reporteRoutes = require('./routes/reporteRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000', // URL del frontend
    credentials: true
}));

app.use(session({
    secret: 'your_secret_key',
    store: new SequelizeStore({ db: sequelize }),
    resave: false,
    saveUninitialized: false,
}));

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/administradores', administradorRoutes);
app.use('/empleados', empleadoRoutes);
app.use('/registros', registroRoutes);
app.use('/departamentos', departamentoRoutes);
app.use('/reportes', reporteRoutes);

// Servir archivos estáticos de React
app.use(express.static(path.join(__dirname, 'frontend', 'my-app', 'build')));

// Ruta catch-all para devolver el archivo index.html de React
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'my-app', 'build', 'index.html'));
});

const PORT = process.env.PORT || 3001;

sequelize.sync({ alter: true }).then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
}).catch(err => {
    console.error('Error al conectar a la base de datos:', err);
});
