const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Create a write stream for the log file
const logStream = fs.createWriteStream(
    path.join(logsDir, `api-${new Date().toISOString().split('T')[0]}.log`),
    { flags: 'a' }
);

const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.connection.remoteAddress;
    const method = req.method;
    const url = req.originalUrl;
    const userAgent = req.get('user-agent');

    // Log the request
    const logEntry = {
        timestamp,
        ip,
        method,
        url,
        userAgent
    };

    // Write to log file
    logStream.write(JSON.stringify(logEntry) + '\n');

    // Log to console
    console.log(`[${timestamp}] ${ip} ${method} ${url}`);

    // Add response logging
    const originalSend = res.send;
    res.send = function (body) {
        const responseTime = Date.now() - req._startTime;
        const statusCode = res.statusCode;
        
        // Log the response
        const responseLog = {
            ...logEntry,
            statusCode,
            responseTime: `${responseTime}ms`
        };

        // Write response to log file
        logStream.write(JSON.stringify(responseLog) + '\n');

        // Log to console
        console.log(`[${timestamp}] ${ip} ${method} ${url} ${statusCode} ${responseTime}ms`);

        return originalSend.call(this, body);
    };

    // Add request start time
    req._startTime = Date.now();

    next();
};

module.exports = logger; 