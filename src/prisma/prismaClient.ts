import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

const connectDb = async () => {
  await prismaClient.$connect();
  console.log("Connected to the database.");
}

export default prismaClient;