import dotenv from "dotenv";
import { api } from "./router/routes.js";

async function main() {
  try {
    dotenv.config();

    await api.listen({ port: 3000, host: "0.0.0.0" });
  } catch (err) {
    api.log.error(err);
    process.exit(1);
  }
}

main();
