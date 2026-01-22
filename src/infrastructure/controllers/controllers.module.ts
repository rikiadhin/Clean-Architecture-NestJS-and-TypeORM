import { Module } from '@nestjs/common';
import { AuthController } from '@infra/controllers/auth/auth.controller';
import { TodoController } from '@infra/controllers/todo/todo.controller';
import { UsecasesProxyModule } from '@infra/usecases-proxy/usecases-proxy.module';
import { AuthCookieModule } from '../common/cookies/auth-cookie.module';

@Module({
  imports: [UsecasesProxyModule.register(), AuthCookieModule],
  controllers: [TodoController, AuthController],
})
export class ControllersModule { }
