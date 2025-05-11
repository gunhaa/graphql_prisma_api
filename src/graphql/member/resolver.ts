import { Member, Order } from '@prisma/client';
import { JoinMemberDto } from './joinMember.dto';
import memberService from './service';

export const memberResolver = {
  Query: {
    getAllMembers: (): Promise<Member[]> => {
      return memberService.getAllMembers();
    },
  },

  Member: {
    orders: (parent: Member, _: any, context: any): Promise<Order[]> => {
      return memberService.getOrders(parent, context);
    },
  },

  Mutation: {
    joinMember: async (
      _: void,
      args: { input: JoinMemberDto }
    ): Promise<Member> => {
      return memberService.joinMember(args.input);
    },
  },
};
