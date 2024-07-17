require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const enviarCorreo = require('./enviarCorreo');
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
const asistenciaRoutes = require('./routes/asistenciaRoutes');
const db = require('./models'); // Asegúrate de importar los modelos
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
    cookie: {
        secure: false, // En producción, asegúrate de que esté configurado en true si usas HTTPS
        maxAge: 1000 * 60 * 60 * 24 // 24 horas
    }
}));

app.post('/api/enviarCorreo', async (req, res) => {
    const { to, subject, text, html, qrDataUrl } = req.body;

    if (!to || !subject || !html || !qrDataUrl) {
        return res.status(400).send('Faltan parámetros necesarios.');
    }

    try {
        await enviarCorreo(to, subject, text, html, qrDataUrl);
        res.status(200).send('Correo enviado');
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).send('Error al enviar el correo');
    }
});

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/administradores', administradorRoutes);
app.use('/empleados', empleadoRoutes);
app.use('/registros', registroRoutes);
app.use('/departamentos', departamentoRoutes);
app.use('/reportes', reporteRoutes);
app.use('/asistencia', asistenciaRoutes);


// Servir archivos estáticos de React
app.use(express.static(path.join(__dirname, 'frontend', 'my-app', 'build')));

// Ruta catch-all para devolver el archivo index.html de React
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'my-app', 'build', 'index.html'));
});

const PORT = process.env.PORT || 3001;

sequelize.authenticate().then(() => {
    console.log('Conexión a la base de datos establecida exitosamente.');
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
}).catch(err => {
    console.error('Error al conectar a la base de datos:', err);
});
