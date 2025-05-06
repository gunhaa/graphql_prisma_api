
export class PlaceOrderDto {
    
    email!: string;
    
    address!: string;

    orderItem!: string;

    constructor(email: string, address: string, orderItem: string){
        this.email = email;
        this.address = address;
        this.orderItem = orderItem;
    }
}