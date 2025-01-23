import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ResetpassAuthDto } from './dto/resetpassword-auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(req: any, response: Response): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    renewToken(refreshToken: string): Promise<{
        access_token: string;
    }>;
    getProfile(req: any): any;
    register(createAuthDto: CreateAuthDto, role: string): Promise<{
        name: string;
        dob: Date;
        cccd: string;
        email: string;
        password: any;
        phone: string;
        codeId: string;
        codeExpired: import("moment").Moment;
    }>;
    forgetPassword(email: string): Promise<string>;
    resetPassword(resetInfo: ResetpassAuthDto): Promise<string>;
    googleAuth(req: any): Promise<string>;
    googleAuthRedirect(req: any): Promise<{
        access_token: string;
    }>;
}
