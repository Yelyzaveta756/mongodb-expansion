import { getAllStudents, getStudentById, createStudent, deleteStudent, updateStudent } from '../services/students.js';

export const getStudentsController = async (req, res) => {
 const students = await getAllStudents();
 const body = req.body;
 console.log(body);

 res.status(200).json({
  data: students,
 });
};

// export const getStudentByIdController = async (req, res, next) => {
//     // Використали try-catch для обробки помилок
//     try {
//         const { studentId } = req.params;
//         const student = await getStudentById(studentId);

//         res.status(200).json({
//             status: 200,
//             message: `Successfully found student with id ${studentId}!`,
//             data: student,
//          });
//     } catch (error) {
//         next(error);
//     }
// };

// Проблема в тому, що нам прийдеться додавати try...catch із шаблонним кодом виклику
// next(err) у кожному контролері. Щоб уникнути повторення коду, створимо допоміжну функцію-обгортку.

// 1. Імпортуємо функцію з бібліотеки
import createHttpError from 'http-errors';

export const getStudentByIdController = async (req, res, next) => {
    const { studentId } = req.params;
    const student = await getStudentById(studentId);


    // Варіант 0
//   if (!student) {
//     res.status(404).json({
//       message: "Student not found",
//     });
//     return;
//   }

//   А тепер додаємо базову обробку помилки замість res.status(404)
//   Створення помилки
//   if (!student) {
//      1 варіант
//     next(new Error('Student not found'));
//     return;
//      2 варіант
//      const error = new Error('Students not found!');
//      error.status = 404;
//      throw error;
//   }

if (!student) {
    // 2. Створюємо та налаштовуємо помилку
    throw createHttpError(404, 'Student not found');
  }

    res.json({
      status: 200,
      message: `Successfully found student with id ${studentId}!`,
      data: student,
    });
  };

  export const createStudentController = async (req, res) => {
    const newStudent = await createStudent(req.body);

    res.status(201).json({
      status: 201,
      message: `Successfully created a student!`,
      data: newStudent,
     });
    };

    export const deleteStudentController = async(req, res, next) => {
      const { studentId } = req.params;
      const deleteById = await deleteStudent(studentId);

      if (!deleteById) {
        next(createHttpError(404, 'Student not found'));
        return;
      }
      res.status(204).send();
    };

    export const updateStudentController = async (req, res, next) => {
      const { studentId } = req.params;
      const result = await updateStudent(studentId, req.body, {
        upsert: true,
      });

      if (!result) {
        next(createHttpError(404, 'Student not found'));
        return;
      }

      const status = result.isNew ? 201 : 200;

      res.status(status).json({
        status,
        message: `Successfully upserted a student!`,
        data: result.student,
      });
    };

    export const patchStudentCollector = async(req, res, next) => {
      const { studentId } = req.params;
      const result = await updateStudent(studentId, req.body);

      if (!result) {
        next(createHttpError(404, 'Student not found'));
        return;
      }

      res.json({
        status: 200,
        message: `Successfully patched a student!`,
        data: result.student,
      });
    };
