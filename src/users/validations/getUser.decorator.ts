import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '../user.entity';

export const GetUser = createParamDecorator((data: string, context: ExecutionContext): User => {
  const ctx = GqlExecutionContext.create(context);
  const user = ctx.getContext().req.user;
  return data ? user?.[data] : user;
});
