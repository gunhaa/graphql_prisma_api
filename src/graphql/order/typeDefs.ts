import { gql } from "graphql-tag";

export const orderTypeDefs = gql`
  scalar DateTime

  type Order {
    id: ID!
    buyer: Member
    orderItems: [OrderItem]
    delivery: Delivery
    createdAt: DateTime
  }

  type Query {
    getAllOrders: [Order]
    orderItems: [OrderItem]
  }

  type Mutation {
    placeOrder(input: PlaceOrderInput!): Order
  }

  input PlaceOrderInput {
    email: String!
    address: String!
    orderItems: [OrderItemDto!]!
  }

  input OrderItemDto {
    itemId: ID!
    """
    주문량
    """
    orderQuantity: Int!
  }
`