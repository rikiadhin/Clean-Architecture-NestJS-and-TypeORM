import { FastifyReply } from 'fastify';
import { AuthLoginDto } from './auth-dto.class';
import { IsAuthPresenter } from './auth.presenter';
import { LoginGuard } from '@infra/common/guards/login.guard';
import { LoginUseCases } from '@usecases/auth/login.usecases';
import { LogoutUseCases } from '@usecases/auth/logout.usecases';
import { JwtAuthGuard } from '@infra/common/guards/jwtAuth.guard';
import JwtRefreshGuard from '@infra/common/guards/jwtRefresh.guard';
import { UseCaseProxy } from '@infra/usecases-proxy/usecases-proxy';
import { ApiResponseType } from '@infra/common/swagger/response.decorator';
import { UsecasesProxyModule } from '@infra/usecases-proxy/usecases-proxy.module';
import { IsAuthenticatedUseCases } from '@usecases/auth/isAuthenticated.usecases';
import { Body, Controller, Get, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SUMMARY } from '@/infrastructure/common/constants/api-operation.contant';
import { ROUTES } from '@/infrastructure/common/constants/routes.contant';
import { AuthCookieService } from '@/infrastructure/common/cookies/auth-cookie.service';
import { TAGS } from '@/infrastructure/common/constants/api-tag.contant';

@Controller(ROUTES.AUTH)
@ApiTags(TAGS.AUTH)
@ApiResponse({
  status: 401,
  description: 'No authorization token was found',
})
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(IsAuthPresenter)
export class AuthController {
  constructor(
    @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
    @Inject(UsecasesProxyModule.LOGOUT_USECASES_PROXY)
    private readonly logoutUsecaseProxy: UseCaseProxy<LogoutUseCases>,
    @Inject(UsecasesProxyModule.IS_AUTHENTICATED_USECASES_PROXY)
    private readonly isAuthUsecaseProxy: UseCaseProxy<IsAuthenticatedUseCases>,
    private readonly authCookieService: AuthCookieService
  ) { }

  @Post(ROUTES.LOGIN)
  @UseGuards(LoginGuard)
  @ApiBearerAuth()
  @ApiBody({ type: AuthLoginDto })
  @ApiOperation({ description: SUMMARY.LOGIN, summary: SUMMARY.LOGIN })
  async login(@Body() auth: AuthLoginDto, @Res({ passthrough: true }) response: FastifyReply) {
    const accessTokenInfo = await this.loginUsecaseProxy.getInstance().getCookieWithJwtToken(auth.username);
    const refreshTokenInfo = await this.loginUsecaseProxy.getInstance().getCookieWithJwtRefreshToken(auth.username);
    this.authCookieService.setAuthCookies(response, accessTokenInfo, refreshTokenInfo);
    return 'Login successful';
  }

  @Post(ROUTES.LOGOUT)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: SUMMARY.LOGOUT, summary: SUMMARY.LOGOUT })
  async logout(@Res({ passthrough: true }) response: FastifyReply) {
    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');
    return 'Logout successful';
  }

  @Get(ROUTES.IS_AUTHENTICATED)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: SUMMARY.IS_AUTHENTICATED, summary: SUMMARY.IS_AUTHENTICATED })
  @ApiResponseType(IsAuthPresenter, false)
  async isAuthenticated(@Req() request: any) {
    const user = await this.isAuthUsecaseProxy.getInstance().execute(request.user.username);
    const response = new IsAuthPresenter();
    response.username = user.username;
    return response;
  }

  @Get(ROUTES.REFRESH)
  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({ description: SUMMARY.REFRESH, summary: SUMMARY.REFRESH })
  async refresh(@Req() request: any, @Res({ passthrough: true }) response: FastifyReply) {
    const accessTokenInfo = await this.loginUsecaseProxy.getInstance().getCookieWithJwtToken(request.user.username);
    this.authCookieService.setAuthCookies(response, accessTokenInfo, null);
    return 'Refresh successful';
  }
}
