import { setupServer } from "./server.js";
import { UPLOAD_DIR, TEMP_UPLOAD_DIR } from "./constants/index.js";
import { createDirIfNotExists } from "./utils/createDirIfNotExists.js";
import { initMongoConnection } from "./db/initMongoCollection.js";

const bootstrap = async () => {
    await initMongoConnection();
    createDirIfNotExists(TEMP_UPLOAD_DIR);
    createDirIfNotExists(UPLOAD_DIR);
    setupServer();
};

  bootstrap();
