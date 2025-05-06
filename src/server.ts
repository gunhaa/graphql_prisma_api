import http from 'http';
import express, { Request, Response } from 'express';
import { DocumentNode } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import {
    ApolloServerPluginLandingPageLocalDefault,
    ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import dotenv from 'dotenv';
import { GraphQLFormattedError } from "graphql";
import { createLoaders } from './graphql/context/context';

dotenv.config();


const startApolloServer = async (typeDefs: DocumentNode, resolvers: any) => {

  const app = express();
  const httpServer = http.createServer(app);
  // env 주입
  const projectType = process.env.NODE_ENV;

  const graphqlErrorHandling = (err: GraphQLFormattedError) => {
    console.error(err);
    return err;
  };

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      projectType === 'production' 
        ? ApolloServerPluginLandingPageProductionDefault()
        : ApolloServerPluginLandingPageLocalDefault({ embed: false }),
    ],
    introspection: true,
    formatError: graphqlErrorHandling,
    validationRules: [depthLimit(7)],
  });

  await apolloServer.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json({ limit: '50mb' }),
    // 안정화 버전을 설치하자..
    // npm install express@4.17.3
    // npm install -D @types/express@4.17.13
    expressMiddleware(apolloServer, {
      context: async ({ req }) => ({
        loaders: createLoaders(),
      })
    })
  )

  app.all('*', (_: Request, res: Response) => {
    res.send('Welcome GraphQL, Use /graphql endpoint.');
  });

  const port = 4000;
  app.listen(port, () => {
    console.log(`Server on! Port : http://localhost:${port}/graphql`);
  });
}

export { startApolloServer };