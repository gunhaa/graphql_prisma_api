import { Order, OrderItem } from "@prisma/client";
import prismaClient from "../../../prisma/prismaClient";
import { GraphQLError } from "graphql";

class OrderService {
  async getOrders(): Promise<Order[]> {
    return await prismaClient.order.findMany();
  }

  async getOrderItems(parent: Order | null, _:any, context: any): Promise<OrderItem[]> {
    if (!parent) {
      throw new GraphQLError(
        "orderItems 명령은 Order의 하위 필드로 조회 할 수 있습니다.",
        {
          extensions: {
            code: "FIELD_RESOLUTION_ERROR",
          },
        }
      );
    }
    return context.loaders.orderItemsLoader.load(parent.id);
  }
}

export default new OrderService();
