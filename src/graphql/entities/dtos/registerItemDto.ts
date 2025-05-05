import { IsNotEmpty, IsNumber, IsString } from "class-validator"


export class RegisterItemDto {

    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsNumber()
    price!: number;

    @IsNumber()
    stockQuantity: number;

    @IsString()
    category!: string;

    constructor(name: string, price: number, stockQuantity:number | undefined, category: string){
        this.name = name;
        this.price = price;
        this.stockQuantity = stockQuantity ?? 100;
        this.category = category;
    }
}