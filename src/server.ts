import http from 'http';
import express from 'express';
import { DocumentNode } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import cors from 'cors';

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
    ],
    introspection: true,
    formatError: (err) => {
      console.log(err);
      return err;
    },
    validationRules: [depthLimit(7)],
  });

  await apolloServer.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json({ limit: '50mb' }),
  )

  const port = 4000;
  app.listen(port, () => {
    console.log(`Server on! Port : ${port}`);
  });
}

export { startApolloServer };