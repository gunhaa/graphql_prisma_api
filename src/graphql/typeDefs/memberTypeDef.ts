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
    setMember(input: MemberCreateInput!): Member
  }

  input MemberCreateInput {
    email: String!
    name: String
    password: String!
    address: String
  }
`