import dotenv from "dotenv";
import { createApolloServer } from "./context/server";
import { config } from "./config";

dotenv.config();
async function startApolloServer() {
  const app = await createApolloServer();
  const port = config.PORT;
  app.listen(port, () => {
    console.log(`Server on! Port : http://localhost:${port}/graphql`);
  });
}

startApolloServer();