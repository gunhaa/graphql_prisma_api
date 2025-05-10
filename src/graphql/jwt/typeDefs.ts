import { gql } from "graphql-tag";

export const jwtTypeDefs = gql`
  scalar DateTime

  type Query {
    login(input: MemberLoginInput): JwtCookie
    getMyOrderSecurely: [Order!]!
  }

  type Mutation {
    registerItemSecurely(input: RegisterItemInput): Item
  }

  type MemberLoginInput {
    email: String!
    password: String!
  }

  type JwtCookie {
    email: String!
    accessToken: String!
    expiredDate: DateTime!
  }
`;
