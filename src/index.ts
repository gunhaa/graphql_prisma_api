import { startApolloServer } from "./context/server"
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { memberResolver } from "./graphql/member/resolver";
import { memberTypeDefs } from "./graphql/member/typeDefs";
import { orderTypeDefs } from "./graphql/order/typeDefs";
import { orderResolver } from "./graphql/order/resolver";
import { itemResolver } from "./graphql/item/resolver";
import { itemTypeDefs } from "./graphql/item/typeDefs";
import { orderItemTypeDefs } from "./graphql/orderItem/typeDefs";
import { deliveryTypeDefs } from "./graphql/delivery/typeDefs";
import { jwtTypeDefs } from "./graphql/jwt/typeDefs";


const typeDefs = mergeTypeDefs([
  memberTypeDefs,
  orderTypeDefs,
  itemTypeDefs,
  orderItemTypeDefs,
  deliveryTypeDefs,
  jwtTypeDefs,
]);

const resolvers = mergeResolvers([
  memberResolver,
  orderResolver,
  itemResolver,
]);


startApolloServer(typeDefs, resolvers);