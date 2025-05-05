import { gql } from "graphql-tag";

export const orderTypeDef = gql`
  scalar DateTime

  type Order {
    id: ID!
    buyer: Member
    orderItems: [OrderItem]
    delivery: Delivery
    createdAt: DateTime
  }

  type Delivery {
    id: ID!
    order: Order
    address: String
    deliveryStatus: DeliveryStatus
    createdAt: DateTime
  }
  
  enum DeliveryStatus {
    PENDING
    SHIPPED
    CANCELLED
  }

  type Query {
    getOrders: [Order]
  }

  type Mutation {
    placeOrder(input: PlaceOrderInput!): Order
  }

  input PlaceOrderInput {
    email: String!
    address: String!
    orderItem: String!
  }
`