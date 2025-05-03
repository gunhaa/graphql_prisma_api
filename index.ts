import { ApolloServer, gql } from "apollo-server";
import { PrismaClient } from "./generated/prisma";

const client = new PrismaClient();

const typeDefs = gql`
  type User {
    id: ID!
    user_name: String!
  }
  type Query {
    User: [User]
  }
`;

const resolvers = {
  Query : {
    User: (_parent: any, _args: any, _context: any ) => { return client.user.findMany() } 
  }
}

const server = new ApolloServer({ typeDefs , resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});