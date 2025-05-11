import { gql } from 'graphql-tag';

export const itemTypeDefs = gql`
  scalar DateTime

  type Item {
    id: ID!
    orderItems: [OrderItem]
    name: String!
    price: Int!
    stockQuantity: Int!
    category: String!
    createdAt: DateTime
  }

  type Query {
    getAllItems: [Item]
  }

  type Mutation {
    registerItem(input: RegisterItemInput!): Item
  }

  input RegisterItemInput {
    name: String!
    price: Int!
    stockQuantity: Int
    category: String!
  }
`;
