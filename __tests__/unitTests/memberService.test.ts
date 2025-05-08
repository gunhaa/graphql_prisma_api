import memberService from "../../src/graphql/member/service";
import { memberResolver } from "../../src/graphql/member/resolver";
import { createLoaders } from "../../src/context/loaders";
import { prismaMock } from "../../prisma/prismaMock";
import { Member, Order } from "@prisma/client";

describe("Member Query, Mutation test ", () => {
  it("getMembers()는 모든 멤버를 반환해야 한다", async () => {
    const mockMembers: Member[] = [];

    for (let i = 0; i < 10; i++) {
      const mockMember: Member = {
        id: i + 1,
        email: `example${i}@example.com`,
        address: `address: example${i}`,
        name: `name${i}`,
        password: `password${i}`,
        createdAt: new Date("2100-10-10"),
      };
      mockMembers.push(mockMember);
    }

    prismaMock.member.findMany.mockResolvedValue(mockMembers);

    const result = await memberService.getMembers();
    expect(result).toEqual(mockMembers);
    expect(prismaMock.member.findMany).toHaveBeenCalled();
    expect(result.length).toBe(10);
  });

  it('orders resolver는 DataLoader를 사용해 멤버별 주문을 배치 조회해야 한다', async () => {
    
    const mockOrders: Order[] = [
      { id: 1, buyerId: 1, createdAt: new Date("2100-10-10") },
      { id: 2, buyerId: 1, createdAt: new Date("2100-10-10") },
      { id: 3, buyerId: 2, createdAt: new Date("2100-10-10") },
    ];

    prismaMock.order.findMany.mockResolvedValue(mockOrders);
    memberService.getOrders = jest.fn().mockResolvedValue(mockOrders);

    const context = createLoaders();

    const [result1, result2] = await Promise.all([
      context.ordersLoader.load(1),
      context.ordersLoader.load(2),
    ]);

    expect(prismaMock.order.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.order.findMany).toHaveBeenCalledWith({
      where: {
        buyerId: { in: [1, 2] },
      },
      include: {
        buyer: true,
        delivery: true,
      },
    });

    expect(result1).toEqual([{ ...mockOrders[0] }, { ...mockOrders[1] }]);
    expect(result2).toEqual([{ ...mockOrders[2] }]);
  });
});
