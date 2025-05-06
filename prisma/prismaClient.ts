import { PrismaClient, Prisma } from "@prisma/client";

const prismaClient = new PrismaClient({
  log:["query"]
});



export default prismaClient;