import { Member, Order } from "@prisma/client";
import prismaClient from "../../../prisma/prismaClient";
import { JoinMemberDto } from "./joinMember.dto";
import { validateJoinMember } from "../../validator/member/joinMember.validator";
import { GraphQLError } from "graphql";
import { MemberLoginDto } from "./memberLogin.dto";
import { JwtCookie } from "../jwt/jwtCookie";
import jwt from 'jsonwebtoken';

class MemberService {
  async getAllMembers(): Promise<Member[]> {
    return prismaClient.member.findMany();
  }

  async getOrders(parent: Member, context: any): Promise<Order[]> {
    // parent가 없다면 호출이 불가하다
    return context.loaders.ordersLoader.load(parent.id);
  }

  async joinMember(input: JoinMemberDto): Promise<Member> {
    const finalInput = {
      ...input,
      name: input.name ?? this.generateRandomName(),
    };

    validateJoinMember(
      finalInput.email,
      finalInput.name,
      finalInput.password,
      finalInput.address
    );

    const findMember = await prismaClient.member.findUnique({
      where: {
        email: input.email,
      },
    });

    if (findMember) {
      throw new GraphQLError("중복된 이메일 입니다", {
        extensions: {
          code: "EMAIL_ALREADY_EXISTS",
        },
      });
    }

    return prismaClient.member.create({
      data: {
        ...finalInput,
        createdAt: new Date(),
      },
    });
  }

  private generateRandomName(): string {
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

  async login(input: MemberLoginDto, JWT_SECRET: any): Promise<JwtCookie> {
    const findMember = await prismaClient.member.findUnique({
      where: {
        email: input.email,
      },
    });

    if (!findMember) {
      throw new GraphQLError('등록되지 않은 이메일 입니다.', {
        extensions: {
          code: 'UNREGISTER_EMAIL_ERROR',
        },
      });
    }

    if(findMember.password !== input.password){
      throw new GraphQLError('올바르지 않은 비밀번호 입니다.', {
        extensions: {
          code: 'INVALID_PASSWORD_ERROR',
        }
      });
    }

    const accessToken = jwt.sign(
      { email: findMember.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const createJwtCookie: JwtCookie = {
      accessToken: accessToken,
    }
    return createJwtCookie;
  }
}

export default new MemberService();
