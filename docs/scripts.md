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
- 초기화 `rm -rf prisma/migrations && npx prisma migrate reset`
- seed 생성
    - npx prisma db seed

- db
```shell
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
mysql -u root -p
pw: 1234
```