import { startApolloServer } from "./server"
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { memberResolver } from "./graphql/resolvers/memberResolver";
import { memberTypeDef } from "./graphql/typeDefs/memberTypeDef";
import { orderTypeDef } from "./graphql/typeDefs/orderTypeDef";
import { orderResolver } from "./graphql/resolvers/orderResolver";
import { itemResolver } from "./graphql/resolvers/itemResolver";
import { itemTypeDef } from "./graphql/typeDefs/itemTypeDef";


const typeDefs = mergeTypeDefs([
  memberTypeDef,
  orderTypeDef,
  itemTypeDef,
]);

const resolvers = mergeResolvers([
  memberResolver,
  orderResolver,
  itemResolver,
]);


startApolloServer(typeDefs, resolvers);