import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from '@infra/logger/logger.module';
import { ExceptionsModule } from '@infra/exceptions/exceptions.module';
import { UsecasesProxyModule } from '@infra/usecases-proxy/usecases-proxy.module';
import { ControllersModule } from '@infra/controllers/controllers.module';
import { BcryptModule } from '@infra/services/bcrypt/bcrypt.module';
import { JwtModule as JwtServiceModule } from '@infra/services/jwt/jwt.module';
import { EnvironmentConfigModule } from '@infra/config/environment-config/environment-config.module';
import { LocalStrategy } from '@infra/common/strategies/local.strategy';
import { JwtStrategy } from '@infra/common/strategies/jwt.strategy';
import { JwtRefreshTokenStrategy } from '@infra/common/strategies/jwtRefresh.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.secret,
    }),
    LoggerModule,
    ExceptionsModule,
    UsecasesProxyModule.register(),
    ControllersModule,
    BcryptModule,
    JwtServiceModule,
    EnvironmentConfigModule,
  ],
  providers: [LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
})
export class AppModule {}
