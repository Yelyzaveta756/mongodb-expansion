import { getAllStudents, getStudentById, createStudent, deleteStudent, updateStudent } from '../services/students.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';

export const getStudentsController = async (req, res) => {
  //Перший пункт: отримати нормальні значення page та perPage, тобто перетворити в числові значення завдяки функції parsePaginationParams (utils)
  // Другий пункт: services
  const {page, perPage} = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const userId = req.user._id;

    const students = await getAllStudents({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
      userId
    });

    res.status(200).json({
      message: 'Successfully found students!',
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
    const userId = req.user._id;

    const student = await getStudentById(studentId, userId);


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
    const userId = req.user._id;
    const newStudent = await createStudent({userId, ...req.body});

    res.status(201).json({
      status: 201,
      message: `Successfully created a student!`,
      data: newStudent,
     });
    };

    export const deleteStudentController = async(req, res, next) => {
      const { studentId } = req.params;
      const userId = req.user._id;
      const deleteById = await deleteStudent(studentId, userId);

      if (!deleteById) {
        next(createHttpError(404, 'Student not found'));
        return;
      }
      res.status(204).send();
    };

    export const updateStudentController = async (req, res, next) => {
      const { studentId } = req.params;
      const userId = req.user._id;
      const result = await updateStudent(studentId, userId, req.body, {
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
      const {_id: userId} = req.user;
      const photo = req.file;
      console.log(photo);

      let photoUrl;

      if (photo) {
        if (env('ENABLE_CLOUDINARY') === 'true') {
          photoUrl = await saveFileToCloudinary(photo);
        } else {
          photoUrl = await saveFileToUploadDir(photo);
        }
      }

      const result = await updateStudent(studentId, userId, {...req.body, photo: photoUrl});

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
