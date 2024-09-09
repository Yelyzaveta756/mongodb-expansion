import { setupServer } from "./server.js";
import { initMongoConnection } from "./db/initMongoCollection.js";

const bootstrap = async () => {
    await initMongoConnection();
    setupServer();
};

  bootstrap();
