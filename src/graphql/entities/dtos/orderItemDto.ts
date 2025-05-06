export class OrderItemDto {
    itemId!: string;
    count!: number;

    constructor(itemId: string, count: number) {
        this.itemId = itemId;
        this.count = count;
    }
}