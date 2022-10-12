import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Admin } from '../entities/admin.entity';

/**
 * JwtAuthGuard로부터 반환받은 유저 정보를 req없이 resolver에서 바로 사용하기 위한 custom decorator
 * admin의 전체 정보가 아닌 특정 정보만 받아보고 싶은 경우를 위해 admin 칼럼을 파라미터로 받아 정보 반환
 * GetUser와 혼용해서 사용할 수 있지만 의미상 분리
 *
 * @author 허정연(golgol22)
 * @return {admin} JwtAuthGuard로부터 반환받은 admin 정보
 */
export const GetAdmin = createParamDecorator((data: string, context: ExecutionContext): Admin => {
  const ctx = GqlExecutionContext.create(context);
  const admin = ctx.getContext().req.user;
  return data ? admin?.[data] : admin;
});
