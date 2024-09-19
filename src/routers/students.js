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

const router = Router();

router.get('/students', validateBody(createStudentSchema), ctrlWrapper(getStudentsController));
router.get('/students/:studentId', isValidId, validateBody(createStudentSchema), ctrlWrapper(getStudentByIdController));
router.post('/students', validateBody(updateStudentSchema), ctrlWrapper(createStudentController));
router.delete('/students/:studentId', isValidId, ctrlWrapper(deleteStudentController));
router.put('/students/:studentId', isValidId, validateBody(createStudentSchema), ctrlWrapper(updateStudentController));
router.patch('/students/:studentId', isValidId, validateBody(updateStudentSchema), ctrlWrapper(patchStudentCollector));

export default router;

