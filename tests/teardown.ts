import { execSync } from "child_process";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

async function resetDatabase() {
  try {
    execSync("npx prisma migrate reset --force", { stdio: "inherit" });
    console.log("db reset fin");
  } catch (error) {
    console.error("error reset database:", error);
  }
}

resetDatabase();
