import { gql } from "graphql-tag";

export const memberTypeDef = gql`
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