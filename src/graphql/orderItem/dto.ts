export class OrderItemDto {
    itemId!: string;
    orderQuantity!: number;

    constructor(itemId: string, orderQuantity: number) {
        this.itemId = itemId;
        this.orderQuantity = orderQuantity;
    }
}