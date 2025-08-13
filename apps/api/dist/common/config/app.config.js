"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
exports.appConfig = {
    port: parseInt(process.env.PORT || '3000', 10),
    environment: process.env.NODE_ENV || 'development',
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:4000',
        credentials: true,
    },
    database: {
        url: process.env.DATABASE_URL || 'mongodb://localhost:27017/engrisk',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    rateLimit: {
        windowMs: 15 * 60 * 1000,
        max: 100,
    },
};
//# sourceMappingURL=app.config.js.map