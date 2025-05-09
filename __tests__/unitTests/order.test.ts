import {
  Delivery,
  DeliveryStatus,
  Item,
  Member,
  Order,
  OrderItem,
} from "@prisma/client";
import { prismaMock } from "../../prisma/prismaMock";
import orderService from "../../src/graphql/order/service";
import { PlaceOrderDto } from "../../src/graphql/order/placeOrder.dto";
import { OrderResult } from "../../src/graphql/order/result.type";
import { OrderItemDto } from "../../src/graphql/orderItem/dto";

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

  it("placeOrder는 생성된 Order를 반환하고, 문제 없이 생성되어야 한다", async () => {
    const exampleEmail = "example1@example1.com";
    const deliveryAddress = "address: 쟤네집";

    const mockMember: Member = {
      id: 1,
      email: exampleEmail,
      address: "address: 1",
      name: "name1",
      password: "password1",
      createdAt: new Date("2100-10-10"),
    };

    const mockItem1: Item = {
      id: 1,
      name: "item1",
      price: 10000,
      stockQuantity: 100,
      category: "category1",
      createdAt: new Date("2100-10-10"),
    };

    const mockItem2: Item = {
      id: 2,
      name: "item2",
      price: 20000,
      stockQuantity: 100,
      category: "category2",
      createdAt: new Date("2100-10-10"),
    };

    const mockResultItem1: Item = {
      id: 1,
      name: "item1",
      price: 10000,
      stockQuantity: 95,
      category: "category1",
      createdAt: new Date("2100-10-10"),
    };

    const mockResultItem2: Item = {
      id: 2,
      name: "item2",
      price: 20000,
      stockQuantity: 95,
      category: "category2",
      createdAt: new Date("2100-10-10"),
    };

    const mockOrderItems: OrderItem[] = [
      {
        id: 1,
        count: 5,
        itemId: 1,
        orderId: 1,
        orderPrice: 50000,
        createdAt: new Date("2100-10-10"),
      },
      {
        id: 2,
        count: 5,
        itemId: 2,
        orderId: 1,
        orderPrice: 100000,
        createdAt: new Date("2100-10-10"),
      },
    ];

    const mockOrderItemsDto: OrderItemDto[] = [
      new OrderItemDto("1", 5),
      new OrderItemDto("2", 5),
    ];

    const mockDelivery: Delivery = {
      id: 1,
      address: deliveryAddress,
      deliveryStatus: DeliveryStatus.PENDING,
      orderId: 1,
      createdAt: new Date("2100-10-10"),
    };

    const mockOrder: Order = {
      id: 1,
      buyerId: 1,
      createdAt: new Date("2100-10-10"),
    };

    const mockOrderResult: OrderResult = {
      ...mockOrder,
      buyer: mockMember,
      delivery: mockDelivery,
      orderItems: mockOrderItems,
    };

    prismaMock.member.findUnique.mockResolvedValue(mockMember);

    const tx = {
      order: {
        create: jest.fn().mockResolvedValue(mockOrder),
      },
      delivery: {
        create: jest.fn().mockResolvedValue(mockDelivery),
      },
      item: {
        findUnique: jest
          .fn()
          .mockResolvedValueOnce(mockItem1)
          .mockResolvedValueOnce(mockItem2),
        update: jest
          .fn()
          .mockResolvedValueOnce(mockResultItem1)
          .mockResolvedValueOnce(mockResultItem2),
      },
      orderItem: {
        create: jest
          .fn()
          .mockResolvedValueOnce(mockOrderItems[0])
          .mockResolvedValueOnce(mockOrderItems[1]),
      },
    };

    prismaMock.$transaction.mockImplementation(async (callback: any) => {
      return callback(tx);
    });

    const createOrder = await orderService.placeOrder(
      new PlaceOrderDto(exampleEmail, deliveryAddress, mockOrderItemsDto)
    );

    expect(tx.item.findUnique).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        select: { id: true, stockQuantity: true, price: true },
        where: { id: Number(mockOrderItemsDto[0].itemId) },
      })
    );
    expect(tx.item.findUnique).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        select: { id: true, stockQuantity: true, price: true },
        where: { id: Number(mockOrderItemsDto[1].itemId) },
      })
    );

    expect(tx.orderItem.create).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        data: expect.objectContaining({
          item: { connect: { id: mockItem1.id } },
          order: { connect: { id: mockOrder.id } },
          orderPrice: mockOrderItemsDto[0].orderQuantity * mockItem1.price,
          count: mockOrderItemsDto[0].orderQuantity,
        }),
      })
    );
    expect(tx.orderItem.create).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        data: expect.objectContaining({
          item: { connect: { id: mockItem2.id } },
          order: { connect: { id: mockOrder.id } },
          orderPrice: mockOrderItemsDto[1].orderQuantity * mockItem2.price,
          count: mockOrderItemsDto[1].orderQuantity,
        }),
      })
    );

    expect(mockOrderResult).toEqual(createOrder);
  });
});
