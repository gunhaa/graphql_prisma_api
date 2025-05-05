import {
    IsEmail,
    IsNotEmpty,
    IsString
} from "class-validator"

export class PlaceOrderDto {
    
    @IsEmail()
    @IsNotEmpty()
    email!: string;
    
    @IsString()
    @IsNotEmpty()
    address!: string;

    @IsNotEmpty()
    orderItem!: string;

    constructor(email: string, address: string, orderItem: string){
        this.email = email;
        this.address = address;
        this.orderItem = orderItem;
    }
}