export declare class AuthService {
    loginTeacher(email: string, password: string): {
        token: string;
        role: string;
        email: string;
    };
}
