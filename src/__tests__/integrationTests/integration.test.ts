import { createApolloServer } from '../../context/server';
import prismaClient from '../../../prisma/prismaClient';
import request from 'supertest';
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";


// import prismaClient from '../../../prisma/prismaClient';
// **jest 시 prismaClient를 사용 못하는 문제 발생, seed 데이터 없는 상태로 가져옴, 테스트 용으로 비워서주는 이상한 로직이 있는거같음**

let app: any;
let jwtToken: any;

describe('docker-compose를 이용해 test용 db를 띄운 후 로직을 테스트한다. 회원가입, 아이템 등록을 검증한 후, 시드 데이터를 이용해 로그인 하여 jwt 토큰을 부여 받은 뒤 나의 주문을 요청 보낸 후 받는 것을 검증한다', () => {
  beforeAll(async () => {
    await prismaClient.$connect();
    app = await createApolloServer();
  });

  it('회원 생성을 검증한다 - 성공', async () => {
    const res = await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation {
            joinMember(
              input: {
                email: "test@test.com",
                password: "example11",
                address: "address11"
              }
            ) {
              email
              password
              address
            }
          }
        `
      });
  
    expect(res.statusCode).toBe(200);
    expect(res.body.data.joinMember.email).toBe('test@test.com');
    expect(res.body.data.joinMember.password).toBe('example11');
    expect(res.body.data.joinMember.address).toBe('address11');
  });
  
  it('회원 생성을 검증한다 - 중복된 이메일(실패)', async () => {
    const res = await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation {
            joinMember(
              input: {
                email: "test@test.com",
                password: "example11",
                address: "address11"
              }
            ) {
              email
              password
              address
            }
          }
        `
      });
  
    expect(res.statusCode).toBe(200);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].message).toContain('중복된 이메일');
    expect(res.body.data.joinMember).toBeNull();
  });

  it('seed member를 이용해 로그인 후 토큰을 발급 받는다. - 성공', async () => { 
    const res = await request(app)
    .post('/graphql')
    .send({
      query: `
        query {
          login (
            input: {
              email: "example1@email.com"
              password: "password1"
            }
          ){
            accessToken
          }
        }
      `
    });

    expect(res.statusCode).toBe(200);

    jwtToken = res.body.data.login.accessToken;
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET!) as jwt.JwtPayload;
    expect(decoded.email).toBe('example1@email.com');
  });

  it('seed member를 이용해 로그인 후 토큰을 발급 받는다. - 비밀번호 불일치(실패)', async () => { 
    const res = await request(app)
    .post('/graphql')
    .send({
      query: `
        query {
          login (
            input: {
              email: "example1@email.com"
              password: "invalidpw13"
            }
          ){
            accessToken
          }
        }
      `
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].message).toContain('올바르지 않은 비밀번호 입니다');
    expect(res.body.data.login).toBeNull();
  });

  it('seed를 이용해 로그인 후 jwt 토큰을 headers에 넣은 후 나의 주문 목록을 요청한다 - N+1 검증은 unit test에서 검증되어 생략한다', async () => {

  const res = await request(app)
  .post('/graphql')
  .set('Authorization', `Bearer ${jwtToken}`)
  .send({
    query: `
      query {
        getMyOrders {
          id
          orderItems {
            id
            count
            orderPrice
            createdAt
            item {
              name
              stockQuantity
              category
            }
          }
          buyer {
            email
            name
          }
          delivery {
            address
            deliveryStatus
          }
          createdAt
        }
      }
    `
  });

  expect(res.statusCode).toBe(200);
  expect(res.body.data.getMyOrders).toBeDefined();
  expect(Array.isArray(res.body.data.getMyOrders)).toBe(true);
  
  const order = res.body.data.getMyOrders[0];
  expect(order.orderItems.length).toBeGreaterThan(0);

  // seed 된 데이터와 일치하는지 검증한다

  // orderItem
  expect(order.orderItems[0].orderPrice).toBe(1000);
  expect(order.orderItems[0].item.name).toBe('item1');
  expect(order.orderItems[0].item.stockQuantity).toBe(98);
  expect(order.orderItems[0].item.category).toBe('category1');

  // buyer
  expect(order.buyer.email).toBe('example1@email.com');
  expect(order.buyer.name).toBe('name1');

  // delivery
  expect(order.delivery).toHaveProperty('address');
  expect(order.delivery.deliveryStatus).toBe('PENDING');
  });


  it('seed를 이용해 로그인 후 jwt 토큰을 headers에 넣은 후 나의 주문 목록을 요청한다 - 유효 하지 않은 토큰(에러)', async () => {

    const invalidToken = 'invalidToken';
    const res = await request(app)
    .post('/graphql')
    .set('Authorization', `Bearer ${invalidToken}`)
    .send({
      query: `
        query {
          getMyOrders {
            id
            orderItems {
              id
              count
              orderPrice
              createdAt
              item {
                name
                stockQuantity
                category
              }
            }
            buyer {
              email
              name
            }
            delivery {
              address
              deliveryStatus
            }
            createdAt
          }
        }
      `
    });
    console.log(res);
    expect(res.statusCode).toBe(200);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].message).toContain('JWT');
    expect(res.body.data.getMyOrders).toBeNull();

    });
  
  afterAll(async () => {
    await prismaClient.member.delete({
      where : {
        email: 'test@test.com',
      }
    })
    await prismaClient.$disconnect();
  });
});
