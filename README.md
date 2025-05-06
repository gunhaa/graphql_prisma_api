
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
    - `npx prisma migrate dev` 실행하여 DB 스키마 생성 및 Client 자동 생성
    - `npx prisma studio`를 이용해 모델 간 관계 및 데이터 확인
    - prisma studio를 이용한 테스트 까지 완료
2. ~~graphql schema 생성~~
3. resolvers 개발
4. 테스트 생성
5. service 레이어로 분리
6. input 값을 validation 하는 validator 클래스 구현