import DataLoader from 'dataloader';
import prismaClient from '../../../prisma/prismaClient';
import { OrderItem } from '@prisma/client';

const batchLoadFn = async (
  orderIds: readonly number[]
): Promise<OrderItem[][]> => {
  const orderItems = await prismaClient.orderItem.findMany({
    where: {
      orderId: { in: orderIds as number[] },
    },
    include: {
      item: true,
    },
  });
  return orderIds.map((orderId) =>
    orderItems.filter((orderItem) => orderItem.orderId === orderId)
  );
};

export const orderItemsLoader = () => new DataLoader(batchLoadFn);
