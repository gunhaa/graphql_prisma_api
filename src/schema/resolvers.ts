import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { memberResolver } from "../graphql/member/resolver";
import { orderResolver } from "../graphql/order/resolver";
import { itemResolver } from "../graphql/item/resolver";

import { jwtResolver } from "../graphql/jwt/resolver";

export const resolvers = mergeResolvers([
  memberResolver,
  orderResolver,
  itemResolver,
  jwtResolver,
]);
