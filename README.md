
## GraphQL - Prisma - TypeScript 기반 주문 API

- Node.js 환경에서 동작하는 주문 처리 API
- Prisma ORM, GraphQL, TypeScript를 중심으로 구성
- GitHub Issue 탭을 활용한 이슈 관리
- trunk-based branching 전략 적용


## ERD 기획
- 해당 모델 Graphql 로 api 생성
    - 일부 스펙변경, 자기 참조 Category 테이블, Item 종류 테이블 제거
![model1](images/model.webp)

## 완성 ERD

- prisma-erd-generator 이용

![model2](prisma/erd/ERD.svg)

- Query
    - getMembers()
    - getOrders()
    - getOrderItems()
    - getItems()
- Mutation
    - joinMember(input: JoinMemberInput)
    - placeOrder(input: PlaceOrderInput)
    - registerItem(input: RegisterItemInput)



# Todo

1. ~~schema.prirma 엔티티 생성, prisma client 생성~~
2. ~~graphql schema 생성~~
3. ~~resolvers 개발~~
    - ~~연관 필드 얻어오기~~
    - ~~N+1 문제 해결(DataLoader)~~
4. ~~서비스 레이어로 분리~~
    - ~~폴더 구조 js스럽게 변경하기~~
5. 테스트 생성
    - seed.ts에서 seed값 생성할때, service로 생성하여 테스트를 일부 대신하는 것으로 구현
6. input 값을 validation 하는 validator 클래스 구현
7. order transaction, lock 을 이용한 critical section mutex로 구현하기