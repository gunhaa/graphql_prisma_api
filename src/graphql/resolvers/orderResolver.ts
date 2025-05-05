import { Member, Order } from "@prisma/client"
import prismaClient from "../../../prisma/prismaClient"
import { PlaceOrderDto } from "../entities/dtos/placeOrderDto"
import { GraphQLError } from "graphql";

export const orderResolver = {
    Query: {
        getOrders : async (_: void, args: any) => await prismaClient.order.findMany()
    },

    Mutation: {
        placeOrder: async (
            _parent: void,
            args: { input: PlaceOrderDto }
            // 수정 필요
        ): Promise<void> => {
            const placeOrderDto = new PlaceOrderDto(
                args.input.email,
                args.input.address,
                args.input.orderItem,
            );
            
            const findMember = await prismaClient.member.findUnique({
                where : {
                    email: placeOrderDto.email,
                }
            });

            if (!findMember){
                throw new GraphQLError("존재하지 않는 이메일 입니다", {
                    extensions: {
                        code: "BAD_EMAIL_INPUT"
                    }
                })
            }

            // orderItem을 이용해 Item을 찾는 로직 실행 추가
            

            // const order = await prismaClient.order.create({
            //     data: {

            //     }
            // })
        }
    }
}