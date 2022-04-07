/* istanbul ignore file */
import createSchema from '../../utils/createSchema';
import { graphql } from 'graphql';
import { Maybe } from 'graphql/jsutils/Maybe';

interface Options {
  source: string;
  variableValues?: Maybe<{ [key: string]: any }>;
  userId?: string;
  headers?: object;
}

const gCall = async ({ source, variableValues, userId, headers = {} }: Options) => {
  const schema = await createSchema();
  return graphql({
    schema,
    source,
    variableValues,
    contextValue: {
      req: {
        session: {
          userId,
          destroy: jest.fn(),
        },
        headers,
      },
      res: {
        clearCookie: jest.fn(),
      },
    },
  });
};

export default gCall;
