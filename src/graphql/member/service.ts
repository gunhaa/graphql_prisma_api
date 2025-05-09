import { Member, Order } from "@prisma/client";
import prismaClient from "../../../prisma/prismaClient";
import { JoinMemberDto } from "./joinMember.dto";
import { validateJoinMember } from "../../validator/member/joinMember.validator";

class MemberService {
  async getMembers(): Promise<Member[]> {
    return prismaClient.member.findMany();
  }

  async getOrders(parent: Member, context: any): Promise<Order[]> {
    // console.log('parent: '+ parent);
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
    return context.loaders.ordersLoader.load(parent.id);
  }

  async joinMember(input: JoinMemberDto): Promise<Member> {

    validateJoinMember(
      input.email,
      input.name,
      input.password,
      input.address
    );

    return prismaClient.member.create({
      data: {
        email: input.email,
        name: input.name,
        password: input.password,
        address: input.address,
        createdAt: new Date(),
      },
    });
  }

  generateRandomName(): string {
    const prefix = [
      "음악하는",
      "요리하는",
      "밥하는",
      "그림그리는",
      "책읽는",
      "운동하는",
      "게임하는",
      "춤추는",
      "노래하는",
      "책쓰는",
    ];
    const suffix = [
      "사람",
      "도깨비",
      "인간",
      "고양이",
      "강아지",
      "요정",
      "슬라임",
      "마법사",
      "엘프",
      "이방인",
    ];
    const maxNumber = 10000;
    const activity = prefix[Math.floor(Math.random() * prefix.length)];
    const entity = suffix[Math.floor(Math.random() * suffix.length)];
    const number = Math.floor(Math.random() * maxNumber);

    return `${activity} ${entity}${number}`;
  }
}

export default new MemberService();
