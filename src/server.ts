


import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
import http from 'http';
import express from 'express';
import { DocumentNode } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';

// const typeDefs = mergeTypeDefs([
//   queries,
//   mutations,
//   enums,
//   equipments.typeDefs,
//   supplies.typeDefs,
//   givens.typeDefs,
//   tools.typeDefs,
//   softwares.typeDefs,
//   people.typeDefs,
// ]);

// const resolvers = mergeResolvers([
//   equipments.resolvers,
//   supplies.resolvers,
//   givens.resolvers,
//   tools.resolvers,
//   softwares.resolvers,
//   people.resolvers,
// ]);



const startApolloServer = async (typeDefs: DocumentNode, resolvers: any) => {
  const app = express();
  const httpServer = http.createServer(app);

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    // csrf 보호
    csrfPrevention: true,
    // 캐시 최대 크기 제한
    cache: 'bounded',
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
    introspection: true,
    formatError: (err) => {
      console.log(err);
      return err;
    },
    validationRules: [depthLimit(7)],
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    // 타입 충돌 문제
    app: app as any,
    path: '/graphql',
  });

  const port = 4000;
  app.listen(port, () => {
    console.log(`Server on! Port : ${port}`);
  });
}

export { startApolloServer };