import { Order } from "@prisma/client";
import { prismaMock } from "../../../prisma/mocks/prismaMock";
import orderService from "../../graphql/order/service";
import { PlaceOrderDto } from "../../graphql/order/placeOrder.dto";
import { mockDelivery, mockItem1, mockItem2, mockMember, mockOrder, mockOrderItems, mockOrderItemsDto, mockOrderResult, mockResultItem1, mockResultItem2 } from "../../../prisma/mocks/testMockData";
import { GraphQLError } from "graphql";

describe('order schema test', () => {
  it('getOrders()는 모든 Order를 반환해야 한다', async () => {
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

    const result = await orderService.getAllOrders();
    expect(result).toEqual(mockOrders);
    expect(prismaMock.order.findMany).toHaveBeenCalled();
    expect(result.length).toBe(10);
  });

  it('placeOrder는 생성된 Order를 반환하고, tx 내부 쿼리가 예측 가능하게 생성되어야 한다', async () => {
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
      new PlaceOrderDto(mockMember.email, mockDelivery.address, mockOrderItemsDto)
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

  it('가입되지 않은 이메일은 에러가 발생해야 한다.', async () => {
    prismaMock.member.findUnique.mockResolvedValue(null);
  
    await orderService
      .placeOrder(
        new PlaceOrderDto(mockMember.email, mockDelivery.address, mockOrderItemsDto)
      )
      .catch((e) => {
        expect(e).toBeInstanceOf(GraphQLError);
        expect(e.message).toBe('가입되지 않은 이메일 입니다');
        expect(e.extensions.code).toBe('INVALID_EMAIL_INPUT');
      });
  });
});
