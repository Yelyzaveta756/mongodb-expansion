// Цей код допомагає уникнути некоректних або шкідливих запитів,
// що можуть призвести до проблем з безпекою або стабільністю системи.

import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, res, next) => {
  const { studentId } = req.params;
  if (!isValidObjectId(studentId)) {
    throw createHttpError(400, 'Bad Request');
  }

  next();
};
