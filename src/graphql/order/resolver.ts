import { Order, Delivery, OrderItem } from "@prisma/client";
import prismaClient from "../../../prisma/prismaClient";
import { PlaceOrderDto } from "./dto";
import { GraphQLError } from "graphql";
import { DeliveryStatusEnum } from "../delivery/enum";

export const orderResolver = {
  Query: {
    getOrders: async (_: void, args: any) => await prismaClient.order.findMany(),
  },

  Order: {
    orderItems: (parent: Order | null, args: any, context: any): Promise<OrderItem[]> => {
      if(!parent) {
        throw new GraphQLError("orderItems 명령은 Order의 하위 필드로 조회 할 수 있습니다.", {
          extensions: {
            code: "FIELD_RESOLUTION_ERROR"
          }
        });
      }
      return context.loaders.orderItemsLoader.load(parent.id);
    }
  },

  Mutation: {
    placeOrder: async (
      _parent: void,
      args: { input: PlaceOrderDto }
      // 수정 필요
    ): Promise<Order> => {
      const placeOrderDto = new PlaceOrderDto(
        args.input.email,
        args.input.address,
        args.input.orderItems
      );

      const findMember = await prismaClient.member.findUnique({
        where: {
          email: placeOrderDto.email,
        },
      });

      if (!findMember) {
        throw new GraphQLError("존재하지 않는 이메일 입니다", {
          extensions: {
            code: "UNVALID_EMAIL_INPUT",
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
            address: placeOrderDto.address,
            deiveryStatus: DeliveryStatusEnum.PENDING,
            createdAt: new Date(),
          },
        });

        for (const orderItemDto of placeOrderDto.orderItems) {
          if (typeof orderItemDto.orderQuantity !== "number") {
            throw new GraphQLError("숫자가 아닙니다.", {
              extensions: { code: "BAD_TYPE_INPUT" },
            });
          }

          const findItem = await tx.item.findUnique({
            select: { id: true, stockQuantity: true, price: true },
            where: { id: Number(orderItemDto.itemId) },
          });

          if (!findItem) {
            throw new GraphQLError("Item not found");
          }

          if(findItem.stockQuantity - orderItemDto.orderQuantity < 0){
            throw new GraphQLError("재고보다 많은 주문 요청 입니다.", {
              extensions: { code: "OVER_ORDER_INPUT" },
            });
          }

          const updatedItem = await tx.item.update({
            where: { id: findItem.id }, 
            data: {
              stockQuantity: findItem.stockQuantity - orderItemDto.orderQuantity
            },
          });

          await tx.orderItem.create({
            data: {
              item: { connect: { id: updatedItem.id } },
              order: { connect: { id: createOrder.id } },
              orderPrice: orderItemDto.orderQuantity * updatedItem.price,
              count: orderItemDto.orderQuantity,
            },
          });
        }

        return createOrder;
      });

      return result;
    },
  },
};
