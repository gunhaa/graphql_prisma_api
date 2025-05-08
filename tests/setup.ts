import { execSync } from "child_process";
import * as dotenv from "dotenv";
import { readdirSync } from "fs";
import { Item, Member, OrderItem, PrismaClient } from "@prisma/client";
import memberService from "../src/graphql/member/service";
import { JoinMemberDto } from "../src/graphql/member/dto";
import itemService from "../src/graphql/item/service";
import { RegisterItemDto } from "../src/graphql/item/dto";
import orderService from "../src/graphql/order/service";
import { PlaceOrderDto } from "../src/graphql/order/placeOrder.dto";
import { OrderItemDto } from "../src/graphql/orderItem/dto";

async function seed() {
  const members: Member[] = [];
  const items: Item[] = [];

  for (let i = 1; i < 11; i++) {
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
      new RegisterItemDto(
        `item${i}`,
        price,
        stockQuantity,
        `category${categoryNum}`
      )
    );
    items.push(registerItem);
  }

  for (const member of members) {
    const orderItems: OrderItemDto[] = [];
    for (let i = 0; i < 2; i++) {
      const orderItem = new OrderItemDto(
        String(i+1),
        i+1
      );
      orderItems.push(orderItem);
    }

    await orderService.placeOrder(
      new PlaceOrderDto(member.email, member.address as string, orderItems)
    );
  }

  console.log("seed success");
}



module.exports = async () => {
  dotenv.config({ path: ".env.test" });

  const migrationsPath = "./prisma/migrations";
  const migrationName = "test";
  const isAlreadyMigrated = readdirSync(migrationsPath).some((dir) =>
    dir.includes(migrationName)
  );

  if (!isAlreadyMigrated) {
    console.log("migration execute");
    execSync(`npx prisma migrate dev --name ${migrationName}`, {
      stdio: "inherit",
      env: {
        ...process.env,
      },
    });
  } else {
    console.log("already migration");
  }

  const prismaClient = new PrismaClient();

  seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prismaClient.$disconnect());

  await prismaClient.$disconnect();
};
