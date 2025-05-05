import {startApolloServer} from "./server"
import { gql } from "graphql-tag";
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';

const typeDefsRaw = gql`

  scalar DateTime

  type Member {
    id: ID!
    email: String!
    name: String
    password: String!
    address: String
    orders: [Order]
    createdAt: DateTime
  }

  type Order {
    id: ID!
    buyer: Member
    delivery: String
    createdAt: DateTime
  }
  
  type Query {
    members: [Member]
  }
`

const resolversRaw = {
  Query : {
    members : () => 
  }
}

const typeDefs = mergeTypeDefs([
  typeDefsRaw,
]);

const resolvers = mergeResolvers([
  resolversRaw,
]);


startApolloServer(typeDefs, resolvers);