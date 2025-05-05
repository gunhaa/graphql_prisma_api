import { startApolloServer } from "./server"
import { gql } from "graphql-tag";
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import prismaClient from "../prisma/prismaClient";
import { Member } from "@prisma/client";
import { CreateMemberDto } from "./graphql/entities/dtos/createMemberDto";
import { validateOrReject } from "class-validator";


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

const resolversRaw = {
  Query: {
    getMembers : (_: void , args: any) => prismaClient.member.findMany()
  },

  Mutation: {
    setMember: async ( 
      _parent: void, 
      args: { input: CreateMemberDto }
    ): Promise<Member> => {
      const createMemberDto = new CreateMemberDto(
        args.input.email,
        args.input.name,
        args.input.password,
        args.input.address
      );

      await validateOrReject(createMemberDto);

      // 멤버 생성 값 반환
      return await prismaClient.member.create({
        data: {
          email: createMemberDto.email,
          name: createMemberDto.name,
          password: createMemberDto.password,
          address: createMemberDto.address,
          createdAt: new Date(),
        }
      });
    }
  }
}

const typeDefs = mergeTypeDefs([
  typeDefsRaw,
]);

const resolvers = mergeResolvers([
  resolversRaw,
]);


startApolloServer(typeDefs, resolvers);