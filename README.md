
# prisma , graphql example api


- 해당 모델 Graphql 로 api 생성
    - 일부 스펙변경, 자기 참조 Category 테이블, Item 종류 테이블 제거

![model](images/model.webp)



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
3. resolvers 개발
    - 연관 필드 얻어오기
    - N+1 문제 해결(DataLoader)
4. 테스트 생성
5. service 레이어로 분리
6. input 값을 validation 하는 validator 클래스 구현