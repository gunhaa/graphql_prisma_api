import { Order, OrderItem } from "@prisma/client";
import { PlaceOrderDto } from "./placeOrder.dto";
import orderService from "./service";

export const orderResolver = {
  Query: {
    getOrders: (): Promise<Order[]> => {
      return orderService.getOrders();
    },
  },

  Order: {
    orderItems: (parent: Order, _: any, context: any): Promise<OrderItem[]> => {
      return orderService.getOrderItems(parent, context);
    }
  },

  Mutation: {
    placeOrder: async (
      _: any,
      args: { input: PlaceOrderDto }
      // 수정 필요
    ): Promise<Order> => {
      return orderService.placeOrder(args.input);
    },
  },
};
