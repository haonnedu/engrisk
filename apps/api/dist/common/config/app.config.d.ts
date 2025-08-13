export declare const appConfig: {
    port: number;
    environment: string;
    cors: {
        origin: string;
        credentials: boolean;
    };
    database: {
        url: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    rateLimit: {
        windowMs: number;
        max: number;
    };
};
