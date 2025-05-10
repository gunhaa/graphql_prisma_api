import { createApolloServer } from "../../src/context/server";
import prismaTestClient from "./prismaTestClient";

let app: any;

describe("docker-compose를 이용해 test용 db를 띄운 후 로직을 테스트한다. 회원가입, 아이템 등록, 주문 등록 후, 로그인 하여 jwt 토큰을 부여 받은 뒤 나의 주문을 요청 보낸 후 받는 것을 검증한다", async () => {
  beforeAll(async () => {
    app = await createApolloServer();
  });

  it("회원 가입 요청", async () => {});

  it("아이템 생성(1,2,3)", async () => {});

  it("주문 등록(1,2)", async () => {});

  it("로그인 요청", async () => {});

  it("나의 주문 요청", async () => {});

  afterAll(async () => {

    await prismaTestClient.orderItem.deleteMany({});
    await prismaTestClient.order.deleteMany({});
    await prismaTestClient.item.deleteMany({});
    await prismaTestClient.member.deleteMany({});

    await prismaTestClient.$disconnect();
  });
});
