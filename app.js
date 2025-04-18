require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const authRoutes = require('./routes/auth.routes');
const signRoutes = require('./routes/sign.routes');
const countRoutes = require('./routes/count.routes');

const app = express();

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB', err));

// app.use(cors());
// app.use(helmet());
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:5500',
        'hhttps://victor-petition-fe.onrender.com'
    ],
    methods: ['POST', 'GET', 'OPTIONS'],
    preflightContinue: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400
};

app.use(cors(corsOptions));

app.use(
    helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }
    })
);

app.use('/', (req, res, next) => {
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    next();
});

app.use(express.json());
app.use(morgan('dev'));
app.use(compression());

// const limiter = rateLimit({
//     max: 100,
//     windowMs: 60 * 60 * 1000,
//     message: 'Too many requests from this IP, please try again in an hour'
// });

// app.use('/api', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sign', signRoutes);
app.use('/api/petitions/count', countRoutes);

// Keep alive
app.use('/ping', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'pong'
    });
});

// 404 handler
app.all('*', (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: `${req.originalUrl} not found`
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
