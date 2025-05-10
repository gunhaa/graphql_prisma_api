import { Delivery, Member, Order, OrderItem } from "@prisma/client";

export type OrderResult = Order & {
    buyer: Member;
    delivery: Delivery;
    orderItems: OrderItem[];
}