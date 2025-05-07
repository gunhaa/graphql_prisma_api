import { Member , Order} from "@prisma/client";
import { JoinMemberDto } from "../entities/dtos/joinMemberDto";
import prismaClient from "../../../prisma/prismaClient";
import { GraphQLError } from "graphql";

export const memberResolver = {
  Query: {
    getMembers: async (_: void, args: any) => await prismaClient.member.findMany(),
  },

  Member: {
    orders: (parent: Member | null, args:any, context:any): Promise<Order[]> => {

      if(!parent){
        throw new GraphQLError("orders 필드는 Member 타입의 하위 필드로 조회할 수 있습니다.", {
          extensions: {
            code: "FIELD_RESOLUTION_ERROR",
          },
        });
      }
      return context.loaders.ordersLoader.load(parent.id);
    }
  },

  Mutation: {
    joinMember: async (
      _parent: void,
      args: { input: JoinMemberDto }
    ): Promise<Member> => {
      const joinMemberDto = new JoinMemberDto(
        args.input.email,
        args.input.name,
        args.input.password,
        args.input.address
      );

      return await prismaClient.member.create({
        data: {
          email: joinMemberDto.email,
          name: joinMemberDto.name,
          password: joinMemberDto.password,
          address: joinMemberDto.address,
          createdAt: new Date(),
        },
      });
    },
  },
};
