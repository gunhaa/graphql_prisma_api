
export class RegisterItemDto {

    readonly name!: string;

    readonly price!: number;

    readonly stockQuantity: number;

    readonly category!: string;

    constructor(name: string, price: number, stockQuantity:number | undefined, category: string){
        this.name = name;
        this.price = price;
        this.stockQuantity = stockQuantity ?? 100;
        this.category = category;
    }
}