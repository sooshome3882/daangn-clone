import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationError } from 'apollo-server-core';

/**
 * JWT 토큰 유효성 검사, user정보 반환
 *
 * @author 허정연(golgol22)
 * @return {user} jwt.strategy로부터 전달받은 user
 * @throws {UnauthorizedException} err가 있거나 user 정보가 없을 경우 예외처리
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw new AuthenticationError('로그인을 해주세요.');
    }
    return user;
  }
}
