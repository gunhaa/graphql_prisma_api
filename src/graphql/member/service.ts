import { Member, Order } from "@prisma/client";
import { GraphQLError } from "graphql";
import prismaClient from "../../../prisma/prismaClient";
import { JoinMemberDto } from "./dto";

class MemberService {
  async getMembers(): Promise<Member[]> {
    return await prismaClient.member.findMany();
  }

  async getOrders(parent: Member | null, context: any): Promise<Order[]> {
    if (!parent) {
      throw new GraphQLError(
        "orders 필드는 Member 타입의 하위 필드로 조회할 수 있습니다.",
        {
          extensions: {
            code: "FIELD_RESOLUTION_ERROR",
          },
        }
      );
    }
    return await context.loaders.ordersLoader.load(parent.id);
  }

  async joinMember(input: JoinMemberDto): Promise<Member> {
    const joinMemberDto = new JoinMemberDto(
        input.email,
        input.name,
        input.password,
        input.address
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
  }
}

export default new MemberService();