import { gql } from "graphql-tag";

export const orderItemTypeDef = gql`
    scalar DateTime

    type OrderItem {
        id: ID!
        order: Order
        item: Item
        orderPrice: Int
        count: Int
        createdAt: DateTime
    }

    type Query {
        getOrderItems: [OrderItem]
    }
`