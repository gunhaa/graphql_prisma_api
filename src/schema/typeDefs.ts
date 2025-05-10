import { itemTypeDefs } from "../graphql/item/typeDefs";
import { orderItemTypeDefs } from "../graphql/orderItem/typeDefs";
import { deliveryTypeDefs } from "../graphql/delivery/typeDefs";
import { jwtTypeDefs } from "../graphql/jwt/typeDefs";
import { memberTypeDefs } from "../graphql/member/typeDefs";
import { orderTypeDefs } from "../graphql/order/typeDefs";
import { mergeTypeDefs } from '@graphql-tools/merge';

export const typeDefs = mergeTypeDefs([
  memberTypeDefs,
  orderTypeDefs,
  itemTypeDefs,
  orderItemTypeDefs,
  deliveryTypeDefs,
  jwtTypeDefs,
]);