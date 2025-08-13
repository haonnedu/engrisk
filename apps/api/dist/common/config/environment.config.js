"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environmentConfig = void 0;
exports.environmentConfig = {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
};
//# sourceMappingURL=environment.config.js.map