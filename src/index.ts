import {startApolloServer} from "./server"
import { gql } from "graphql-tag";
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';

const typeDefsRaw = gql`
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`

const resolversRaw = {
  Query : {
    books : () => books
  }
}

const books = [
  {
    title: 'dooli',
    author: 'gunha',
  },
  {
    title: 'pig',
    author: 'insoo',
  }
]

const typeDefs = mergeTypeDefs([
  typeDefsRaw,
]);

const resolvers = mergeResolvers([
  resolversRaw,
]);


startApolloServer(typeDefs, resolvers);