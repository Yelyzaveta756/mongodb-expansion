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

const router = Router();

router.get('/students', ctrlWrapper(getStudentsController));
router.get('/students/:studentId', ctrlWrapper(getStudentByIdController));
router.post('/students', ctrlWrapper(createStudentController));
router.delete('/students/:studentId', ctrlWrapper(deleteStudentController));
router.put('/students/:studentId', ctrlWrapper(updateStudentController));
router.patch('/students/:studentId', ctrlWrapper(patchStudentCollector));

export default router;

