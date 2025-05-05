import { gql } from "graphql-tag";

export const orderItemTypeDef = gql`
    scalar DateTime

    type OrderItem {
        id: ID!
        order: Order
        Item: Item
        orderPrice: Int
        count: Int
        createdAt: DateTime
    }

    type Query {
        getOrderItems: [OrderItem]
    }
    
    type Mutation {
        registerOrderItemInput(input: RegisterOrderItemInput!): OrderItem
    }
    
    input RegisterOrderItemInput {
    }
`