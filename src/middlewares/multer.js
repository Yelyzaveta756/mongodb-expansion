import multer from "multer";

import { TEMP_UPLOAD_DIR } from "../constants/index.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, TEMP_UPLOAD_DIR);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `${uniqueSuffix}_${file.originalname}`);
    }
  });

//   const storage = multer.memoryStorage() // Такий підхід може здатися вам зручнішим, адже ми в такому випадку
// одразу зможемо отримати Buffer із контентом файлу в нашому коді і нам не треба буде додатково вичитувати вміст файлу.
// Проте такий підхід може привести до того, що у нас збільшиться витрата оперативної памʼяті

  export const upload = multer({ storage });
