import winston from 'winston';

export const logger = winston.createLogger({
    level: process.env.DEBUG !== 'false' ? 'debug' : 'info',
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.colorize({
            all: true,
        }),
        winston.format.timestamp({
            format: 'MMM-DD-YYYY HH:mm:ss',
        }),
        winston.format.align(),
        winston.format.printf(
            (info) => `[${info.level}] ${[info.timestamp]}: ${info.message}`
        )
    ),
});
