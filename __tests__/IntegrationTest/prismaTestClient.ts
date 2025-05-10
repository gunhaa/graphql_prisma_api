import { PrismaClient } from "@prisma/client";

const prismaTestClient = new PrismaClient({
  log: ["query","warn", "error"],
});

export default prismaTestClient;