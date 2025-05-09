import { Item } from "@prisma/client";
import { RegisterItemDto } from "./registerItem.dto";
import itemService from "./service";

export const itemResolver = {
  Query: {
    getItems: (): Promise<Item[]> => {
      return itemService.getItems();
    },
  },

  Mutation: {
    registerItem: (_: void, args: { input: RegisterItemDto }): Promise<Item> => {
      return itemService.registerItem(args.input);
    },
  },
};
