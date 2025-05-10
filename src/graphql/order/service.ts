import {
  Delivery,
  DeliveryStatus,
  Order,
  OrderItem,
} from '@prisma/client';
import prismaClient from '../../../prisma/prismaClient';
import { GraphQLError } from 'graphql';
import { PlaceOrderDto } from './placeOrder.dto';
import { OrderResult } from './orderResult.type';
import { memberStatus } from '../jwt/memberStatus.type';
import authValidator from '../../validator/authValidator';
import { validatePlaceOrder } from '../../validator/order/placeOrder.validator';


class OrderService {
  async getAllOrders(): Promise<Order[]> {
    return await prismaClient.order.findMany({
      include: {
        buyer: true,
        delivery: true,
      }
    });
  }

  async getMyOrders(memberStatus: memberStatus): Promise<Order[]> {
    
    authValidator.validateAuthorized(memberStatus);

    const findMember = await prismaClient.member.findUnique({
      where: {
        email: memberStatus.email as string,
      },
    });

    if (!findMember) {
      throw new GraphQLError(
        '정상적인 JWT로 요청하였으나, 이메일 정보가 일치하지 않습니다. 발급되지 않은 JWT일 수 있습니다.',
        {
          extensions: { code: 'JWT_INVALID_EMAIL_ERROR' },
        }
      );
    }

    const orders: Order[] = await prismaClient.order.findMany({
      where: {
        buyerId: findMember.id,
      },
      include: {
        buyer: true,
        delivery: true,
      },
    });
    return orders;
  }

  async getOrderItems(parent: Order, context: any): Promise<OrderItem[]> {
    // parent가 없다면 리졸버가 실행되지 않는다
    return context.loaders.orderItemsLoader.load(parent.id);
  }

  async placeOrder(input: PlaceOrderDto): Promise<Order> {

    validatePlaceOrder(input.email, input.address, input.orderItems);

    const findMember = await prismaClient.member.findUnique({
      where: {
        email: input.email,
      },
    });

    if (!findMember) {
      throw new GraphQLError('가입되지 않은 이메일 입니다', {
        extensions: {
          code: 'INVALID_EMAIL_INPUT',
        },
      });
    }

    // Order - Delivery - OrderItem 순으로 만들어낸다
    // 주문을 만들어내야 이후 동작이 가능하다
    // 하나의 트랜잭션으로 묶어서 동작해야 한다
    const result = await prismaClient.$transaction(async (tx) => {
      const createOrder: Order = await tx.order.create({
        data: {
          buyer: {
            connect: { id: findMember.id },
          },
          createdAt: new Date(),
        },
      });

      const createDelivery: Delivery = await tx.delivery.create({
        data: {
          order: {
            connect: { id: createOrder.id },
          },
          address: input.address,
          deliveryStatus: DeliveryStatus.PENDING,
          createdAt: new Date(),
        },
      });

      const createdOrderItems: OrderItem[] = [];

      for (const orderItemDto of input.orderItems) {
        if (typeof orderItemDto.orderQuantity !== 'number') {
          throw new GraphQLError('숫자가 아닙니다.', {
            extensions: { code: 'BAD_TYPE_INPUT' },
          });
        }

        const findItem = await tx.item.findUnique({
          select: { id: true, stockQuantity: true, price: true },
          where: { id: Number(orderItemDto.itemId) },
        });

        if (!findItem) {
          throw new GraphQLError('등록되지 않은 아이템 입니다', {
            extensions: { code: 'INVALID_ITEMID_INPUT' },
          });
        }

        if (findItem.stockQuantity - orderItemDto.orderQuantity < 0) {
          throw new GraphQLError('재고보다 많은 주문 요청 입니다.', {
            extensions: { code: 'OVER_ORDER_INPUT' },
          });
        }

        const updatedItem = await tx.item.update({
          where: { id: findItem.id },
          data: {
            stockQuantity: findItem.stockQuantity - orderItemDto.orderQuantity,
          },
        });

        const createOrderItem = await tx.orderItem.create({
          data: {
            item: { connect: { id: updatedItem.id } },
            order: { connect: { id: createOrder.id } },
            orderPrice: orderItemDto.orderQuantity * updatedItem.price,
            count: orderItemDto.orderQuantity,
          },
        });

        createdOrderItems.push(createOrderItem);
      }

      const result: OrderResult = {
        ...createOrder,
        buyer: findMember,
        delivery: createDelivery,
        orderItems: createdOrderItems,
      };

      return result;
    });

    return result;
  }
}

export default new OrderService();
