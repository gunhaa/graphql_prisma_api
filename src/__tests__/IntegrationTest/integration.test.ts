import { Item, Member, PrismaClient } from '@prisma/client';
import { createApolloServer } from '../../context/server';

// import prismaClient from '../../../prisma/prismaClient';
// **prismaClient를 불러서 가져오면 문제가 생긴다, seed 데이터 없는 상태로 가져옴, 테스트 용으로 비워서주는 이상한 로직이 있는거같음**



let app: any;
let prismaClient: any;

describe('docker-compose를 이용해 test용 db를 띄운 후 로직을 테스트한다. 회원가입, 아이템 등록, 주문 등록 후, 로그인 하여 jwt 토큰을 부여 받은 뒤 나의 주문을 요청 보낸 후 받는 것을 검증한다', () => {
  beforeAll(async () => {
    app = await createApolloServer();
    prismaClient = new PrismaClient();
  });

  it('seed로 생성된 회원 테스트', async () => {
    const members: Member[] = await prismaClient.member.findMany();
    for (const member of members) {
      const findMember = await prismaClient.member.findUnique({
        where: {
          email: member.email
        }
      });
      expect(findMember).toMatchObject({
        id: member.id,
        email: member.email,
        name: member.name,
        address: member.address,
        password: member.password,
      });
    };
  });

  it('seed로 생성된 아이템 테스트', async () => {
    const items: Item[] = await prismaClient.item.findMany();
    for (const item of items) {
      const findItem = await prismaClient.item.findUnique({
        where: {
          id: item.id,
        }
      });

      expect(findItem).toMatchObject({
        id: item.id,
        category: item.category,
        name: item.name,
        price: item.price,
        stockQuantity: item.stockQuantity,
      });
    };
  });

  it('seed로 생성된 주문 테스트', async () => { });

  it('로그인 요청', async () => { });

  it('나의 주문 요청', async () => { });

  afterAll(async () => {

    // await prismaClient.orderItem.deleteMany({});
    // await prismaClient.order.deleteMany({});
    // await prismaClient.item.deleteMany({});
    // await prismaClient.member.deleteMany({});

    await prismaClient.$disconnect();
  });
});
