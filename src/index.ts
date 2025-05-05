import { startApolloServer } from "./server"
import { gql } from "graphql-tag";
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { memberResolver } from "./graphql/resolvers/memberResolver";
import { memberTypeDef } from "./graphql/typeDefs/memberTypeDef";

const typeDefsRaw = gql`
  scalar DateTime

  type Order {
    id: ID!
    buyer: Member
    delivery: Delivery
    createdAt: DateTime
  }

  type Delivery {
    id: ID!
    order: Order
    address: String
    deliveryStatus: DeliveryStatus
    createdAt: DateTime
  }
  
  enum DeliveryStatus {
    PENDING
    SHIPPED
    CANCELLED
  }
`


const typeDefs = mergeTypeDefs([
  memberTypeDef,
  typeDefsRaw
]);

const resolvers = mergeResolvers([
  memberResolver,
]);


startApolloServer(typeDefs, resolvers);