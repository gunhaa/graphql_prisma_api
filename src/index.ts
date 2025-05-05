import { startApolloServer } from "./server"
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { memberResolver } from "./graphql/resolvers/memberResolver";
import { memberTypeDef } from "./graphql/typeDefs/memberTypeDef";
import { orderTypeDef } from "./graphql/typeDefs/orderTypeDef";


const typeDefs = mergeTypeDefs([
  memberTypeDef,
  orderTypeDef,
]);

const resolvers = mergeResolvers([
  memberResolver,
]);


startApolloServer(typeDefs, resolvers);