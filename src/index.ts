import { api } from "./router/routes.js";

async function main() {
  try {
    await api.listen({ port: 3000 });
  } catch (err) {
    api.log.error(err);
    process.exit(1);
  }
}

main();
