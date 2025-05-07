import { Member, Order } from "@prisma/client";
import { JoinMemberDto } from "./dto";
import prismaClient from "../../../prisma/prismaClient";
import memberService from "./service";

export const memberResolver = {
  Query: {
    // getMembers: async () => await prismaClient.member.findMany(),
    getMembers: () => {
      return memberService.getMembers();
    },
  },

  Member: {
    orders: (
      parent: Member | null,
      _: any,
      context: any
    ): Promise<Order[]> => {
      // if (!parent) {
      //   throw new GraphQLError(
      //     "orders 필드는 Member 타입의 하위 필드로 조회할 수 있습니다.",
      //     {
      //       extensions: {
      //         code: "FIELD_RESOLUTION_ERROR",
      //       },
      //     }
      //   );
      // }
      // return context.loaders.ordersLoader.load(parent.id);
      return memberService.getOrders(parent, context);
    },
  },

  Mutation: {
    joinMember: async (
      _: void,
      args: { input: JoinMemberDto }
    ): Promise<Member> => {
      // const joinMemberDto = new JoinMemberDto(
      //   args.input.email,
      //   args.input.name,
      //   args.input.password,
      //   args.input.address
      // );

      // return await prismaClient.member.create({
      //   data: {
      //     email: joinMemberDto.email,
      //     name: joinMemberDto.name,
      //     password: joinMemberDto.password,
      //     address: joinMemberDto.address,
      //     createdAt: new Date(),
      //   },
      // });

      return memberService.joinMember(args.input);
    },
  },
};
