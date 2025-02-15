import {Request} from "express";
import {User} from "../entities/users.entity";

export interface SignInResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        email: string;
        name: string;
        role: string;
        isVerified: boolean;
    };
}

export interface ResponseInterceptor<T> {
    message: string;
    data: T;
}

export interface JwtPayload {
    userId: string;
}

export interface RequestInterface extends Request {
    user: User;
}