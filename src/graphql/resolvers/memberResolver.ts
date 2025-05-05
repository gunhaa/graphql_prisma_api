import { Member } from "@prisma/client";
import { CreateMemberDto } from "../entities/dtos/createMemberDto";
import { validateOrReject } from "class-validator";
import prismaClient from "../../../prisma/prismaClient";

export const memberResolver = {
    Query: {
        getMembers : (_: void , args: any) => prismaClient.member.findMany()
      },
    
      Mutation: {
        joinMember: async ( 
          _parent: void, 
          args: { input: CreateMemberDto }
        ): Promise<Member> => {
          const createMemberDto = new CreateMemberDto(
            args.input.email,
            args.input.name,
            args.input.password,
            args.input.address
          );
    
          await validateOrReject(createMemberDto);
    
          // 멤버 생성 값 반환
          return await prismaClient.member.create({
            data: {
              email: createMemberDto.email,
              name: createMemberDto.name,
              password: createMemberDto.password,
              address: createMemberDto.address,
              createdAt: new Date(),
            }
          });
        }
      }
}