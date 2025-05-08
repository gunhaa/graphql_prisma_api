
# prisma , graphql example api


- 해당 모델 Graphql 로 api 생성
    - 일부 스펙변경, 자기 참조 Category 테이블, Item 종류 테이블 제거

## ERD 기획

![model1](images/model.webp)

## 완성 ERD

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
4. 서비스 레이어로 분리
    - ~~폴더 구조 js스럽게 변경하기~~
5. 테스트 생성
6. input 값을 validation 하는 validator 클래스 구현
7. order transaction, lock 을 이용한 critical section mutex로 구현하기