import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import express from 'express';
import session from 'express-session';
import createSchema from '@utils/createSchema';
import prisma from '@utils/prisma';
import redis from '@utils/redis';
import path from 'path';

const isProd = process.env.NODE_ENV === 'production';
const client = process.env.WEB_CLIENT_URL;
const dotenvPath = isProd ? path.join(__dirname, '..', '.env') : path.join(__dirname, '..', `.env.${process.env.NODE_ENV}`);
require('dotenv').config({ path: dotenvPath });

const PORT = process.env.PORT || 4000;
const whitelist = isProd ? [client] : [client, 'https://studio.apollographql.com', 'http://localhost:4000'];
const corsOptions = {
  credentials: true,
  origin: function (origin: string, callback: any) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  } as any,
};

const main = async () => {
  const schema = await createSchema();
  const app = express();
  const apolloServer = new ApolloServer({ schema, context: ({ req, res }: any) => ({ req, res }) });
  const RedisStore = connectRedis(session);

  !isProd && app.set('trust proxy', 1);

  app.use(
    session({
      store: new RedisStore({
        client: redis,
      }),
      name: process.env.SECRET_COOKIE,
      secret: process.env.SECRET_SESSION as string,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: false,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
        sameSite: 'none',
      },
    })
  );

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: corsOptions,
  });

  app.listen(PORT, () => {
    console.log('\x1b[32m', `🚀 Server started on http://localhost:${PORT}/graphql 🚀`);
  });
};

{
  (' ');
}
main()
  .catch((e: any) => {
    console.error('\x1b[31m', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
