/* istanbul ignore file */
import { Authorized, Query, Resolver } from 'type-graphql';

@Resolver()
class TestResolver {
  @Authorized(['USER', 'MANAGER', 'ADMIN'])
  @Query(() => String)
  async test(): Promise<string> {
    return 'test';
  }

  @Authorized(['MANAGER', 'ADMIN'])
  @Query(() => String)
  async testManager(): Promise<string> {
    return 'testManager';
  }

  @Authorized(['ADMIN'])
  @Query(() => String)
  async testAdmin(): Promise<string> {
    return 'testAdmin';
  }
}

export default TestResolver;
