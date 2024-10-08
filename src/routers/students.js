import { Router } from 'express';
import {
    getStudentsController,
    getStudentByIdController,
    createStudentController,
    deleteStudentController,
    updateStudentController,
    patchStudentCollector
  } from '../controllers/students.js';
  import { ctrlWrapper } from '../utils/ctrlWrapper.js';
  import { validateBody } from '../middlewares/validateBody.js';
  import { isValidId } from '../middlewares/isValidId.js';
  import { createStudentSchema, updateStudentSchema } from '../validation/students.js';
  import { authenticate } from '../middlewares/authenticate.js';
  import { upload } from '../middlewares/multer.js';

export const studentsRouter = Router();

studentsRouter.use(authenticate);

studentsRouter.get('/students', ctrlWrapper(getStudentsController));
studentsRouter.get('/students/:studentId', isValidId, ctrlWrapper(getStudentByIdController));
studentsRouter.post('/students', upload.single('photo'), validateBody(createStudentSchema), ctrlWrapper(createStudentController));
studentsRouter.delete('/students/:studentId', isValidId, ctrlWrapper(deleteStudentController));
studentsRouter.put('/students/:studentId', upload.single('photo'), isValidId, validateBody(createStudentSchema), ctrlWrapper(updateStudentController));
studentsRouter.patch('/students/:studentId', upload.single('photo'), isValidId, validateBody(updateStudentSchema), ctrlWrapper(patchStudentCollector));


