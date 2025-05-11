export class OrderItemDto {
  readonly itemId!: string;
  readonly orderQuantity!: number;

  constructor(itemId: string, orderQuantity: number) {
    this.itemId = itemId;
    this.orderQuantity = orderQuantity;
  }
}
