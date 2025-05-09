import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUserInterface } from 'src/interfaces/users.interface';

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): IUserInterface => {
    const request: Request & { user: IUserInterface } = context
      .switchToHttp()
      .getRequest();
    const user = request?.user;
    return {
      id: user?.id,
      username: user?.username,
    };
  },
);
