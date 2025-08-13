import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    loginTeacher(body: {
        email: string;
        password: string;
    }): {
        token: string;
        role: string;
        email: string;
    };
}
