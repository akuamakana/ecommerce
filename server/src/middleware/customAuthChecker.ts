import prisma from '@utils/prisma';
import { AuthChecker } from 'type-graphql';
import { MyContext } from 'types/MyContext';

const customAuthChecker: AuthChecker<MyContext> = async ({ context }, roles) => {
  if (!context.req.session!.userId) {
    return false;
  }
  const user = await prisma.user.findUnique({ where: { id: context.req.session!.userId } });
  if (!user || !roles.includes(user.role)) {
    return false;
  }

  return true;
};

export default customAuthChecker;
