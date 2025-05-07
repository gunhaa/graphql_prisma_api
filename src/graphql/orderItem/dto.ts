export class OrderItemDto {
    itemId!: string;
    stockQuantity!: number;

    constructor(itemId: string, stockQuantity: number) {
        this.itemId = itemId;
        this.stockQuantity = stockQuantity;
    }
}