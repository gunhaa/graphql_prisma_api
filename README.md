
# prisma , graphql example api

- npx prisma migrate dev
    - generated, migration 만들어냄
    - schema.prisma를 통해 생성
    - migrate는 generate를 포함한다
- npx prisma generate
    - prisma client 생성
- npx prisma studio
    - 관계도 확인

- 해당 모델 Graphql 로 api 생성

![model](images/model.webp)

- Query
    - getMember(name)
    - getOrder(name, orderStatus)
    - getOrderItem(order)
    - getItem(name)
    - getItem(category)
    - getCategory()
    - getDelivery(order)
- Mutation
    - setMember(inputMember)
    - setOrder(inputOrder)
    - setItem(inputItem)
    - setCategory(inputCategory)
    - setOrderStatus(inputOrderStatus)


# Todo

1. schema.prirma 엔티티 생성, prisma client 까지 생성
    - `npx prisma migrate dev` 실행하여 DB 스키마 생성 및 Client 자동 생성
    - `npx prisma studio`를 이용해 모델 간 관계 및 데이터 확인
2. graphql schema 생성
    - 각 모델에 대한 type, input, Query, Mutation 작성
3. resolvers 개발
    - 각 Query, Mutation에 대한 resolver 함수 구현
4. ApolloServer에 schema, resolvers 연결
5. 테스트 생성