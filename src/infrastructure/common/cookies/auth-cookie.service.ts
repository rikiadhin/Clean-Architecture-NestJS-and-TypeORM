import { FastifyReply } from 'fastify';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthCookieService {
    setAuthCookies(
        response: FastifyReply,
        accessTokenInfo?: { token: string; maxAge: string },
        refreshTokenInfo?: { token: string; maxAge: string },
    ) {
        if (accessTokenInfo) {
            response.setCookie('accessToken', accessTokenInfo.token, {
                path: '/',
                httpOnly: true,
                secure: true,
                maxAge: Number(accessTokenInfo.maxAge),
            });
        }
        if (refreshTokenInfo) {
            response.setCookie('refreshToken', refreshTokenInfo.token, {
                path: '/',
                httpOnly: true,
                secure: true,
                maxAge: Number(refreshTokenInfo.maxAge),
            });
        }
    }

    clearAuthCookies(response: any) {
        response.clearCookie('accessToken');
        response.clearCookie('refreshToken');
    }
}
