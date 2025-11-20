const express = require('express');
const helmet = require('helmet');
const winston = require('winston');

const app = express();

// -------------------------------
//  Winston Logger Setup
// -------------------------------
const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'security.log' })
    ]
});

// Log application start
logger.info("Application started");

// Log every request
app.use((req, res, next) => {
    logger.info(`Request: ${req.method} ${req.url}`);
    next();
});

// Security middleware
app.use(helmet());
app.use(express.json());

// ROUTES IMPORT
const userRoutes = require('./userRoutes');

// Use routes
app.use('/api', userRoutes);

// Default Route
app.get('/', (req, res) => {
    logger.info("Default route accessed");
    res.send("Server is running...");
});

// Start Server
app.listen(3000, () => {
    logger.info("Server running on port 3000");
    console.log("Server running on port 3000");
});
