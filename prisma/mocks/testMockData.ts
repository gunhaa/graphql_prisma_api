import { Delivery, DeliveryStatus, Item, Member, Order, OrderItem } from "@prisma/client";
import { OrderResult } from "../../src/graphql/order/result.type";
import { OrderItemDto } from "../../src/graphql/orderItem/orderItem.dto";

export const mockMember: Member = {
  id: 1,
  email: "example1@example1.com",
  address: "address: 1",
  name: "name1",
  password: "password1",
  createdAt: new Date("2100-10-10"),
};

export const mockItem1: Item = {
  id: 1,
  name: "item1",
  price: 10000,
  stockQuantity: 100,
  category: "category1",
  createdAt: new Date("2100-10-10"),
};

export const mockItem2: Item = {
  id: 2,
  name: "item2",
  price: 20000,
  stockQuantity: 100,
  category: "category2",
  createdAt: new Date("2100-10-10"),
};

export const mockResultItem1: Item = {
  id: 1,
  name: "item1",
  price: 10000,
  stockQuantity: 95,
  category: "category1",
  createdAt: new Date("2100-10-10"),
};

export const mockResultItem2: Item = {
  id: 2,
  name: "item2",
  price: 20000,
  stockQuantity: 95,
  category: "category2",
  createdAt: new Date("2100-10-10"),
};

export const mockOrderItems: OrderItem[] = [
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

export const mockOrderItemsDto: OrderItemDto[] = [
  new OrderItemDto("1", 5),
  new OrderItemDto("2", 5),
];

export const mockDelivery: Delivery = {
  id: 1,
  address: "address: 쟤네집",
  deliveryStatus: DeliveryStatus.PENDING,
  orderId: 1,
  createdAt: new Date("2100-10-10"),
};

export const mockOrder: Order = {
  id: 1,
  buyerId: 1,
  createdAt: new Date("2100-10-10"),
};

export const mockOrderResult: OrderResult = {
  ...mockOrder,
  buyer: mockMember,
  delivery: mockDelivery,
  orderItems: mockOrderItems,
};