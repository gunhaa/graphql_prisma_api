import { Order } from "@prisma/client";
import { prismaMock } from "../../prisma/prismaMock";
import orderService from '../../src/graphql/order/service';

describe("order schema test", () => {
  it("getOrders()는 모든 Order를 반환해야 한다", async () => {
    const mockOrders: Order[] = [];

    for (let i = 1; i <= 10; i++) {
      const mockOrder: Order = {
        id: i,
        buyerId: 1,
        createdAt: new Date("2100-10-10"),
      };
      mockOrders.push(mockOrder);
    }

    prismaMock.order.findMany.mockResolvedValue(mockOrders);

    const result = await orderService.getOrders();
    expect(result).toEqual(mockOrders);
    expect(prismaMock.order.findMany).toHaveBeenCalled();
    expect(result.length).toBe(10);
  });
});
