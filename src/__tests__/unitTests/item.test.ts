import { Item } from "@prisma/client";
import { prismaMock } from "../../../prisma/mocks/prismaMock";
import itemService from "../../graphql/item/service";
import { RegisterItemDto } from "../../graphql/item/registerItem.dto";
import { mockItem1 } from "../../../prisma/mocks/testMockData";

describe('item schema test', () => {
  it('getItems()는 모든 아이템을 반환해야 한다', async () => {
    const mockItems: Item[] = [];
    for (let i = 1; i <= 10; i++) {
      const mockItem: Item = {
        id: i,
        category: `category${i % 2}`,
        name: `name${i}`,
        price: i * 10000,
        stockQuantity: i * 10,
        createdAt: new Date('2100-10-10'),
      };
      mockItems.push(mockItem);
    }

    prismaMock.item.findMany.mockResolvedValue(mockItems);

    const result = await itemService.getAllItems();
    expect(result).toEqual(mockItems);
    expect(prismaMock.item.findMany).toHaveBeenCalled();
    expect(result.length).toBe(10);
  });

  it('registerItem()은 아이템을 등록 후 반환하여야 한다', async () => {

    prismaMock.item.create.mockResolvedValue(mockItem1);

    const result = await itemService.registerItem(new RegisterItemDto(mockItem1.name, mockItem1.price, mockItem1.stockQuantity, mockItem1.category));

    expect(result).toEqual(mockItem1);
    expect(prismaMock.item.create).toHaveBeenCalled();
    expect(result.stockQuantity).toBe(mockItem1.stockQuantity);
  });

  it('registerItem()는 stockQuantity가 없다면 100으로 설정되야 한다', async () => {
    const mockItem: Item = {
        id: 1,
        name: 'item',
        price: 10000,
        stockQuantity: 100,
        category: 'category1',
        createdAt: new Date('2100-10-10'),
    };


    prismaMock.item.create.mockResolvedValue(mockItem);

    const result = await itemService.registerItem(new RegisterItemDto('item', 10000, undefined, 'category1'));

    expect(result).toEqual(mockItem);
    expect(prismaMock.item.create).toHaveBeenCalled();
    expect(result.stockQuantity).toBe(mockItem.stockQuantity);
  });


});
