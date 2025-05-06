import { Item, Member, Order } from "@prisma/client";
import prismaClient from "../../../prisma/prismaClient";
import { PlaceOrderDto } from "../entities/dtos/placeOrderDto";
import { GraphQLError } from "graphql";

export const orderResolver = {
  Query: {
    getOrders: async (_: void, args: any) =>
      await prismaClient.order.findMany(),
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
      const result = await prismaClient.$transaction(async (tx) => {
        const createOrder = await tx.order.create({
          data: {
            buyer: {
              connect: { id: findMember.id },
            },
            createdAt: new Date(),
          },
        });

        await tx.delivery.create({
          data: {
            order: {
              connect: { id: createOrder.id },
            },
            address: placeOrderDto.address,
            deiveryStatus: "PENDING",
            createdAt: new Date(),
          },
        });

        for (const orderItemDto of placeOrderDto.orderItems) {
          if (typeof orderItemDto.count !== "number") {
            throw new GraphQLError("숫자가 아닙니다.", {
              extensions: { code: "BAD_TYPE_INPUT" },
            });
          }

          const findItem = await tx.item.findUnique({
            where: { id: Number(orderItemDto.itemId) },
          });

          if (!findItem) {
            throw new GraphQLError("Item not found");
          }

          await tx.orderItem.create({
            data: {
              item: { connect: { id: findItem.id } },
              order: { connect: { id: createOrder.id } },
              orderPrice: orderItemDto.count * findItem.price,
              count: orderItemDto.count,
            },
          });
        }

        return createOrder;
      });

      return result;
    },
  },
};
