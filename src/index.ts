import { startApolloServer } from "./context/server"
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { memberResolver } from "./graphql/member/resolver";
import { memberTypeDef } from "./graphql/member/typeDefs";
import { orderTypeDef } from "./graphql/order/typeDefs";
import { orderResolver } from "./graphql/order/resolver";
import { itemResolver } from "./graphql/item/resolver";
import { itemTypeDef } from "./graphql/item/typeDefs";
import { orderItemTypeDef } from "./graphql/orderItem/typeDefs";


const typeDefs = mergeTypeDefs([
  memberTypeDef,
  orderTypeDef,
  itemTypeDef,
  orderItemTypeDef,
]);

const resolvers = mergeResolvers([
  memberResolver,
  orderResolver,
  itemResolver,
]);


startApolloServer(typeDefs, resolvers);