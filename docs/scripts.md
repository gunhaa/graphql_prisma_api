## 스크립트 정리
- npx prisma migrate dev --name dev
    - generated, migration 만들어냄
    - schema.prisma를 통해 생성
    - migrate는 generate를 포함한다
- npx prisma generate
    - prisma client 생성
    - prisma erd 생성
- npx prisma studio
    - 관계도 확인
    - schema.prisma
```shell
generator erd {
  provider = "prisma-erd-generator"
  output   = "./erd/ERD.svg"
  theme = "forest"
}
```
- 초기화 
    - `rm -rf prisma/migrations && npx prisma migrate reset`
    - npx prisma migrate reset은 데이터베이스(drop table) 삭제 후, prisma/migrations 폴더에 있는 마이그레이션들을 순서대로 다시 적용, seed가 있다면 seed를 진행한다
- seed 생성
    - npx prisma db seed



## 실행
1. `npm run docker:up`
2. `npx prisma migrate dev --name dev`
3. `npm run dev`

## 테스트
1. `npm run docker:testUp`
2. `npx dotenv-cli --e .env.test -- prisma migrate test --name test`
3. `npx dotenv-cli --e .env.test prisma db seed`
4. `npx dotenv-cli --e .env.test -- jest`
5. `npm run docker:down`

### 테스트 불가능으로 임시 제거
- script : "test:local:mac": "npm run docker:testUp && npm run prisma:migrate:local && dotenv --env ./.env.test -- jest --passWithNoTests && npm docker:down",