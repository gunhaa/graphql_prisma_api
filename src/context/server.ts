import http from "http";
import express, { Application, Request, Response } from "express";
import depthLimit from "graphql-depth-limit";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import { GraphQLFormattedError } from "graphql";
import { createLoaders } from "./loaders";
import { JwtUtil } from "../graphql/jwt/jwtUtil";
import { resolvers } from "../schema/resolvers";
import { typeDefs } from "../schema/typeDefs";
import { config } from "../config";



const createApolloServer = async (): Promise<Application> => {
  const app= express();
  const httpServer = http.createServer(app);

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
      config.PROJECT_TYPE === "production"
        ? ApolloServerPluginLandingPageProductionDefault()
        : ApolloServerPluginLandingPageLocalDefault({ embed: false }),
    ],
    introspection: true,
    formatError: graphqlErrorHandling,
    validationRules: [depthLimit(7)],
  });

  await apolloServer.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json({ limit: "50mb" }),
    // npm install express@4.17.3
    // npm install -D @types/express@4.17.13
    expressMiddleware(apolloServer, {
      context: async ({ req , res }) => ({
        loaders: createLoaders(),
        jwtContext: {
          JWT_SECRET: config.JWT_SECRET,
          JWT_EXPIRATION: '1h',
        }, 
        member: JwtUtil.verifyHeader(req.headers.authorization, config.JWT_SECRET),
      }),
    })
  );

  app.all("*", (_: Request, res: Response) => {
    res.send("Welcome GraphQL, Use /graphql endpoint.");
  });

  return app;
};

export { createApolloServer };