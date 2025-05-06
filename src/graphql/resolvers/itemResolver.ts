import { Item } from "@prisma/client";
import prismaClient from "../../../prisma/prismaClient";
import { RegisterItemDto } from "../entities/dtos/registerItemDto";

export const itemResolver = {
    Query: {
        getItems : async () => await prismaClient.item.findMany()
    },

    Mutation: {
        registerItem: async (
            _parent: void,
            args: { input: RegisterItemDto }
        ): Promise<Item> => {
            const registerItemDto = new RegisterItemDto(
                args.input.name,
                args.input.price,
                args.input.stockQuantity,
                args.input.category,
            )

            // 같은 가격, 아이템이라도 새롭게 추가 될 수 있으니 중복 검사는 생략

            return await prismaClient.item.create({
                data: {
                    name: registerItemDto.name,
                    price: registerItemDto.price,
                    stockQuantity: registerItemDto.stockQuantity,
                    category: registerItemDto.category,
                    createdAt: new Date,
                }
            });
        }
    }
}