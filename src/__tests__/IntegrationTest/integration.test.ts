import { Item, Member, Order, PrismaClient } from '@prisma/client';
import { createApolloServer } from '../../context/server';
import memberService from '../../graphql/member/service';
import itemService from '../../graphql/item/service';
import orderService from '../../graphql/order/service';
import prismaClient from '../../../prisma/prismaClient';
import { JoinMemberDto } from '../../graphql/member/joinMember.dto';
import dotenv from 'dotenv';

// import prismaClient from '../../../prisma/prismaClient';
// **jest 시 prismaClient를 사용 못하는 문제 발생, seed 데이터 없는 상태로 가져옴, 테스트 용으로 비워서주는 이상한 로직이 있는거같음**

let app: any;
dotenv.config(); 

describe('docker-compose를 이용해 test용 db를 띄운 후 로직을 테스트한다. 회원가입, 아이템 등록, 주문 등록 후, 로그인 하여 jwt 토큰을 부여 받은 뒤 나의 주문을 요청 보낸 후 받는 것을 검증한다', () => {
  beforeAll(async () => {
    await prismaClient.$connect();
    // app = await createApolloServer();
  });

  it('회원 생성', async () => {

    const result = await prismaClient.$queryRaw`SELECT COUNT(*) FROM Member`;
    console.log('rawQuery Result : ' + result);

    const joinMember: Member = await memberService.joinMember(
      new JoinMemberDto(
        'example@example.com',
        'name',
        'password123',
        'addreess: address',
      )
    );

    // const joinMember: Member = await prismaTestClient.member.create({
    //   data: {
    //     email: 'example@example.com',
    //     name: 'name',
    //     password: 'password123',
    //     address: 'addreess: address',
    //     createdAt: new Date(),
    //   }
    // });

    console.log(`joinMember: ${joinMember}`);

    const findMember : Member = await prismaClient.member.findUnique({
      where : {
        email: joinMember.email,
      }
    }) as Member;
    expect(joinMember).toMatchObject({
        id: findMember.id,
        email: findMember.email,
        name: findMember.name,
        address: findMember.address,
        password: findMember.password,
        createdAt: findMember.createdAt,
    });
  });

  it('로그인 요청', async () => { });

  it('나의 주문 요청', async () => { });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });
});
