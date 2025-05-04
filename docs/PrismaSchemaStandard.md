# Prisma Schema Standard

- 가독성 있는 필드명을 최우선으로 삼는다
- 필드명에 두칸을 띄운 후, 가장 먼 문자를 기준으로 정렬한다
- 이후 어노테이션은 두칸 띄어 쓰는 것을 원칙으로 한다
- 관계형 필드는 가독성이 있는 이름이 있다면 그것을 필드명으로 사용한다
    - 가독성 좋은 이름이 없는 경우, 연관되는 model 명을 필드명으로 삼는다
- 필드명은 lowerCamelCase로 작성하며, table의 필드의 경우 @map 어노테이션을 활용하여 snake case로 재작성 한다
- 예시
```shell
model Member {
  id         Int  @default(autoincrement())  @id  @map("member_id")
  email      String  @unique
  name?      String
  password   String
  address?   String
  orders     Order[]
  createdAt  DateTime  @default(now()) @map("created_at")
}

model Order {
  id             Int  @id  @default(autoincrement())  @map("order_id")
  orderItems     OrderItem[]  
  buyerId        Int  @map("buyer_id")  
  buyer          Member  @relation(fields: [buyerId], references: [id], onDelete: Cascade)
  deliveryId     Int  @map("delivery_id")
  delivery       Delivery  @relation(fields: [deliveryId], references: [id], onDelete: Cascade)
  createdAt      DateTime  @default(now()) @map("created_at")
}
```