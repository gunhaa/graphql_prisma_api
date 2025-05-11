import { Item } from "@prisma/client";
import prismaClient from "../../../prisma/prismaClient";
import { RegisterItemDto } from "./registerItem.dto";

class ItemService {
  async getAllItems(): Promise<Item[]> {
    return prismaClient.item.findMany();
  }

  async registerItem(input: RegisterItemDto): Promise<Item> {
    const registerItemDto = new RegisterItemDto(
      input.name,
      input.price,
      input.stockQuantity,
      input.category
    );

    // 같은 가격, 아이템이라도 새롭게 추가 될 수 있으니 중복 검사는 생략

    return prismaClient.item.create({
      data: {
        name: registerItemDto.name,
        price: registerItemDto.price,
        stockQuantity: registerItemDto.stockQuantity,
        category: registerItemDto.category,
        createdAt: new Date(),
      },
    });
  }
}

export default new ItemService();
