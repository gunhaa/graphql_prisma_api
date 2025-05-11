import { createApolloServer } from '../../context/server';
import prismaClient from '../../../prisma/prismaClient';
import request from 'supertest';
import dotenv from 'dotenv';

// import prismaClient from '../../../prisma/prismaClient';
// **jest 시 prismaClient를 사용 못하는 문제 발생, seed 데이터 없는 상태로 가져옴, 테스트 용으로 비워서주는 이상한 로직이 있는거같음**

let app: any;
let jwtToken: any;

describe('docker-compose를 이용해 test용 db를 띄운 후 로직을 테스트한다. 회원가입, 아이템 등록, 주문 등록 후, 로그인 하여 jwt 토큰을 부여 받은 뒤 나의 주문을 요청 보낸 후 받는 것을 검증한다', () => {
  beforeAll(async () => {
    await prismaClient.$connect();
    app = await createApolloServer();
  });

  it('회원 생성을 검증한다 - 생성', async () => {
    return request(app)
    .post('/graphql')
    .send({
      query: 
      `mutation {
        joinMember (
          input:  {
            email: "example11@example.com"
            password: "example11"
            address: "address11"
          }
        ){
        email
        password
        address
        }
      }`
    })
    .expect(200)
    .expect( res => {
      expect(res.body.data.joinMember.email).toBe('example11@example.com');
      expect(res.body.data.joinMember.password).toBe('example11');
      expect(res.body.data.joinMember.address).toBe('address11');
    })
  });

  it('회원 생성을 검증한다 - 중복된 이메일(실패)', async () => { 
    return request(app)
    .post('/graphql')
    .send({
      query: 
      `mutation {
        joinMember (
          input:  {
            email: "example11@example.com"
            password: "example11"
            address: "address11"
          }
        ){
        email
        password
        address
        }
      }`
    })
    .expect(200)
    .expect( res => {
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toContain('중복된 이메일 입니다');
      expect(res.body.data.joinMember).toBeNull();
    })
  });

  it('seed를 이용해 로그인 후 jwt 토큰을 이용해 나의 주문을 요청한다', async () => { });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });
});
