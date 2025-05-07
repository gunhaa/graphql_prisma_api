import { gql } from "graphql-tag";

export const deliveryTypeDefs = gql`
  scalar DateTime

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
`;
