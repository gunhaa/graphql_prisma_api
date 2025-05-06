import DataLoader from "dataloader";
import prismaClient from "../../../prisma/prismaClient";
import { Order } from "@prisma/client";

const batchLoadFn = async (
  memberIds: readonly number[]
): Promise<Order[][]> => {
  const orders = await prismaClient.order.findMany({
    where: {
      id: { in: memberIds as number[] },
    },
  });
  return memberIds.map((memberId) => orders.filter((order) => order.buyerId === memberId));
};

export const orderLoader = () => new DataLoader(batchLoadFn);