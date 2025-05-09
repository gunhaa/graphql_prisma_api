import { gql } from "graphql-tag";

export const memberTypeDefs = gql`
  scalar DateTime

  type Member {
    id: ID!
    """
    이메일은 고유한 값이어야 하며, '@' 기호가 포함된 유효한 이메일 형식이어야 합니다.
    """
    email: String!
    """
    이름은 선택 사항입니다. 사용자가 입력하지 않더라도 null 값을 가질 수 있습니다.
    이름에 null이 들어온 경우 default(generateRandomName())이 자동으로 들어갑니다.
    이름은 20자 이하로 입력해야 합니다.
    """
    name: String
    """
    암호는 8~20자 이내여야 하며, 최소한 하나의 숫자와 하나의 알파벳을 포함해야 합니다.
    """
    password: String!
    """
    주소는 선택 사항입니다. 사용자가 입력하지 않더라도 null 값을 가질 수 있습니다.
    """
    address: String
    """
    사용자의 주문 목록입니다. 사용자가 주문한 내역이 있을 경우, 그 정보가 포함됩니다.
    100자 이하의 주소로 입력해야 합니다.
    """
    orders: [Order]
    """
    사용자가 회원 가입을 한 날짜와 시간입니다. 생성 시 자동으로 할당됩니다.
    """
    createdAt: DateTime
  }

  type Query {
    getMembers: [Member]
    orders: [Order]
  }

  type Mutation {
    joinMember(input: MemberJoinInput!): Member
  }

  input MemberJoinInput {
    email: String!
    name: String
    password: String!
    address: String
  }
`