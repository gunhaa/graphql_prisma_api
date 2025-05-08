import { Item, Member, OrderItem, PrismaClient } from "@prisma/client";
import memberService from "../src/graphql/member/service";
import { JoinMemberDto } from "../src/graphql/member/dto";
import itemService from "../src/graphql/item/service";
import { RegisterItemDto } from "../src/graphql/item/dto";
import orderService from "../src/graphql/order/service";
import { PlaceOrderDto } from "../src/graphql/order/placeOrder.dto";
import { OrderItemDto } from "../src/graphql/orderItem/dto";

const prismaClient = new PrismaClient();

async function main() {
  const members: Member[] = [];
  const items: Item[] = [];

  for (let i = 0; i < 10; i++) {
    const joinMember: Member = await memberService.joinMember(
      new JoinMemberDto(
        `example${i}@email.com`,
        `name${i}`,
        `password${i}`,
        `addreess: ${i}`
      )
    );
    members.push(joinMember);

    const price = i * 1000;
    const stockQuantity = i * 100;
    const categoryNum = i % 2;
    const registerItem: Item = await itemService.registerItem(
      new RegisterItemDto(`item${i}`, price, stockQuantity, `category${categoryNum}`)
    );
    items.push(registerItem);
  }

  // 1 ~ 10
  const randomInt = (): number => Math.floor(Math.random() * 10) + 1;

  for (const member of members) {
    const orderItems: OrderItemDto[] = [];
    for (let i = 0; i < 2; i++) {
      const orderItem = new OrderItemDto(String(randomInt()), randomInt());
      orderItems.push(orderItem);
    }
  
    await orderService.placeOrder(new PlaceOrderDto(member.email, member.address as string, orderItems));
  }

  console.log('seed success');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prismaClient.$disconnect());
