import { gql } from "graphql-tag";

export const memberTypeDefs = gql`
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

  type Query {
    getMembers: [Member]
    orders: [Order]
  }

  type Mutation {
    joinMember(input: MemberJoinInput!): Member
  }

  input MemberJoinInput {
    email: String!
    name: String
    password: String!
    address: String
  }
`