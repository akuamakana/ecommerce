import { MiddlewareFn } from 'type-graphql';
import { MyContext } from 'types/MyContext';

export const isRole: MiddlewareFn<MyContext> = async ({ context }, next) => {
  if (!context.req.session!.userId) {
    throw new Error('Not authenticated');
  }

  return next();
};
