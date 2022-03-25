import { Ctx, Mutation, Resolver } from 'type-graphql';
import { MyContext } from 'types/MyContext';

@Resolver()
class LogoutResolver {
  @Mutation(() => Boolean, { nullable: true })
  async logout(@Ctx() ctx: MyContext): Promise<Boolean> {
    return new Promise((res, rej) => {
      /* istanbul ignore next */
      ctx.req.session.destroy((err) => {
        if (err) {
          console.error(err);
          return rej(false);
        }
      });

      ctx.res.clearCookie('qid');
      return res(true);
    });
  }
}

export default LogoutResolver;
