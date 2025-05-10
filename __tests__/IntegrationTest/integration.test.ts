import request from 'supertest'
import { createApolloServer } from '../../src/context/server' // ApolloServer + Express 통합한 함수
import jwt from 'jsonwebtoken'

let app: any

beforeAll(async () => {
  app = await createApolloServer();
})
