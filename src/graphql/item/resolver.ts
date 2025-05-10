import { Item } from "@prisma/client";
import { RegisterItemDto } from "./registerItem.dto";
import itemService from "./service";

export const itemResolver = {
  Query: {
    getAllItems: (): Promise<Item[]> => {
      return itemService.getAllItems();
    },
  },

  Mutation: {
    registerItem: (_: void, args: { input: RegisterItemDto }): Promise<Item> => {
      return itemService.registerItem(args.input);
    },
  },
};
