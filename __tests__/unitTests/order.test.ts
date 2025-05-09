import { Order } from "@prisma/client";
import { prismaMock } from "../../prisma/prismaMock";
import orderService from '../../src/graphql/order/service';
import { PlaceOrderDto } from "../../src/graphql/order/placeOrder.dto";

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

  it('placeOrder는 생성된 Order를 반환하고, 문제 없이 생성되어야 한다', async () => {
    const mockOrder: Order = {
      id: 1, 
      buyerId: 1,
      createdAt: new Date('2100-10-10'),
    };

    prismaMock.order.create.mockResolvedValue(mockOrder);

    const createOrder = await orderService.placeOrder(new PlaceOrderDto());

    expect(createMember).toEqual({
      ...mockMember,
      createdAt: new Date('2100-10-10'),
    });
  });
});
