import { OrderItemDto } from "../orderItem/orderItem.dto";

export class PlaceOrderDto {
    
    email!: string;
    
    address!: string;

    orderItems!: OrderItemDto[];

    constructor(email: string, address: string, orderItems: OrderItemDto[]){
        this.email = email;
        this.address = address;
        this.orderItems = orderItems;
    }
}