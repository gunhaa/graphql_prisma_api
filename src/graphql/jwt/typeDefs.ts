import { gql } from "graphql-tag";

export const jwtTypeDefs = gql`
  scalar DateTime

  type Query {
    login(input: MemberLoginInput!): JwtCookie
    getMyOrderSecurely: [Order!]!
  }

  type Mutation {
    registerItemSecurely(input: RegisterItemInput!): Item
  }

  input MemberLoginInput {
    email: String!
    password: String!
  }

  type JwtCookie {
    accessToken: String!
  }
`;
