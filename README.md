
# prisma , graphql example api

- npx prisma migrate dev
    - generated, migration 만들어냄
    - schema.prisma를 통해 생성
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