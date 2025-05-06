import { Member } from "@prisma/client";
import { JoinMemberDto } from "../entities/dtos/joinMemberDto";
import { validateOrReject } from "class-validator";
import prismaClient from "../../../prisma/prismaClient";

export const memberResolver = {
    Query: {
        getMembers : async (_: void , args: any) => await prismaClient.member.findMany()
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
    
          // 멤버 생성 값 반환
          return await prismaClient.member.create({
            data: {
              email: joinMemberDto.email,
              name: joinMemberDto.name,
              password: joinMemberDto.password,
              address: joinMemberDto.address,
              createdAt: new Date(),
            }
          });
        }
      }
}