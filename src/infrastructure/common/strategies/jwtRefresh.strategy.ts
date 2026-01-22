import { Request } from 'express';
import { TokenPayload } from '@domain/model/auth';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { LoggerService } from '@infra/logger/logger.service';
import { LoginUseCases } from '@usecases/auth/login.usecases';
import { UseCaseProxy } from '@infra/usecases-proxy/usecases-proxy';
import { ExceptionsService } from '@infra/exceptions/exceptions.service';
import { UsecasesProxyModule } from '@infra/usecases-proxy/usecases-proxy.module';
import { EnvironmentConfigService } from '@infra/config/environment-config/environment-config.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(
    private readonly configService: EnvironmentConfigService,
    @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
    private readonly logger: LoggerService,
    private readonly exceptionService: ExceptionsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refreshToken;
        },
      ]),
      secretOrKey: configService.getJwtRefreshSecret(),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    const refreshToken = request.cookies?.refreshToken;
    const user = this.loginUsecaseProxy.getInstance().getUserIfRefreshTokenMatches(refreshToken, payload.username);
    if (!user) {
      this.logger.warn('JwtStrategy', `User not found or hash not correct`);
      this.exceptionService.UnauthorizedException({ message: 'User not found or hash not correct' });
    }
    return user;
  }
}
