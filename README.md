
## GraphQL - Prisma - TypeScript 기반 주문 API

- Node.js 환경에서 동작하는 주문 처리 API
- Prisma ORM, GraphQL, TypeScript사용
- 이슈 발생시 GitHub Issue 탭을 활용
- trunk-based branch 전략 사용

## 문서

- [Project Coding Standard](docs/ProjectCodingStandard.md)
- [Prisma Schema Standard](docs/PrismaSchemaStandard.md)
- [테스트 완료 쿼리](docs/testCompleteQuery.md)


## ERD 기획
- 해당 모델 Graphql 로 api 생성
    - 일부 스펙변경, 자기 참조 Category 테이블, Item 종류 테이블 제거
![model1](images/model.webp)

## 완성 ERD

- prisma-erd-generator 사용

![model2](prisma/erd/ERD.svg)
- 인증이 필요없는 API
    - Query
        - ~~getAllMembers()~~
        - ~~getAllOrders()~~
        - ~~getAllOrderItems()~~
        - ~~getAllItems()~~
    - Mutation
        - ~~joinMember(input: JoinMemberInput)~~
        - ~~placeOrder(input: PlaceOrderInput)~~
        - ~~registerItem(input: RegisterItemInput)~~
- 인증이 필요한 API(jwt 인증 관리)
    - ~~login()~~
        - jwt 얻어오기
    - ~~getMyOrders()~~
        - jwt 토큰을 이용한 나의 주문 정보 얻어오기

## Todo

1. ~~schema.prirma 엔티티 생성, prisma client 생성~~
2. ~~graphql schema 생성~~
3. ~~resolvers 개발~~
    - ~~연관 필드 얻어오기~~
    - ~~N+1 문제 해결(DataLoader)~~
4. ~~서비스 레이어로 분리~~
    - ~~폴더 구조 js스럽게 변경하기~~
5. ~~테스트 생성~~
    - ~~seed.ts 생성~~
    - ~~unit test는 mock 사용하여 구현~~
    - ~~integration test는 test db(docker container) 사용하여 구현~~
6. ~~input 값을 validation 하는 validator 클래스 구현~~
    - ~~joinMember~~
7. ~~order transaction, lock 을 이용한 critical section 설정~~
    - 검색 아이템을 한번 더 검증하는 로직으로 방어
    - 실제 결제 로직이라면 성능을 많이 희생하는 비관적 락, mutex 사용하는게 나을듯
8. ~~jwt를 사용하는 인증 관련 API 추가~~
    - ~~access token 발급(1h), 인증 구현~~
        - 빠른 개발을 위해 로직 제거(refresh, blacklist, db 저장 제거)
        - 인증 완료시 프론트 측에서 header에 'Authorization': `Bearer ${accessToken}` 넣는다 가정
9. ~~integration test 구현~~
## 설정

- NODE_ENV=development
    - 브라우저에서 바로 GraphQL 요청을 테스트할 수 있도록 플레이그라운드를 자동으로 켭니다.
    - ApolloServerPluginLandingPageLocalDefault({ embed: false }) 사용

- NODE_ENV=production
    - 운영 환경에서는 보안을 위해 플레이그라운드가 비활성화되고, Apollo 기본 랜딩페이지가 뜹니다.
    - ApolloServerPluginLandingPageProductionDefault() 사용

- 기본값은 development로 설정되어 있지만, Docker-compose NODE_ENV 값을 읽어 실행 시점에 동적으로 분기되므로 .env 파일에서 NODE_ENV=production으로 바꾸기만 하면 운영 모드로 자동 전환됩니다.
- 기본포트
## 실행
### production
- prod환경은 docker-compose로 app, db 모두 컨테이너화
    - 실행
        - npm run prod:dockerUp
        - docker-compose exec app npx prisma migrate deploy
    - 종료
        - npm run docker:down
### development
- dev환경은 로컬/docker db 사용
    - npm install
    - npm run docker:up
    - npx prisma migrate dev --name dev
    - npm run dev
    - npm run docker:down
### test
- test 환경은 로컬/docker db 사용
    - npm install
    - npm run test:dockerUp
    - npm run test:migrate
    - 유닛 테스트 실행
        - npm run test:unit
    - 통합 테스트 실행
        - npm run test:e2e