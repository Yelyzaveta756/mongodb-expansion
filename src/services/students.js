import { StudentsCollection } from "../db/model/students.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";
import { SORT_ORDER } from "../constants/index.js";

export const getAllStudents = async ({
      page = 1,
      perPage= 10,
      sortOrder = SORT_ORDER.ASC,
      sortBy = '_id',
      filter = {},
      userId,
    }) => {
  const skip = (page - 1) * perPage;

  const studentsQuery = StudentsCollection.find();

  if (filter.gender) {
    studentsQuery.where('gender').equals(filter.gender);
  }
  if (filter.maxAge) {
    studentsQuery.where('age').lte(filter.maxAge);
  }
  if (filter.minAge) {
    studentsQuery.where('age').gte(filter.minAge);
  }
  if (filter.maxAvgMark) {
    studentsQuery.where('avgMark').lte(filter.maxAvgMark);
  }
  if (filter.minAvgMark) {
    studentsQuery.where('avgMark').gte(filter.minAvgMark);
  }
  if(userId) {
    studentsQuery.where('userId').equals(userId);
  }


  // Другий пункт !!!
  /* Замість цього коду */

  // const students = await studentsQuery
  // .skip(skip)
  // .limit(perPage)
  // .sort({ [sortBy]: sortOrder })
  // .exec();
  // метод sort дозволяє організувати записи за полем, вказаним у sortBy, у порядку, заданому у sortOrder.

  // const studentsCount = await StudentsCollection.find()
  //   .merge(studentsQuery)
  //   .countDocuments(); // вираховуємо загальну кількість

  /* Ми можемо написати такий код */

const [studentsCount, students] = await Promise.all([
  StudentsCollection.find(userId).merge(studentsQuery).countDocuments(),
  studentsQuery
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder })
    .exec(),
]);

// У рефакторингованій версії коду, замість послідовного виконання, обидві операції запускаються одночасно.
// Promise.all приймає масив промісів і повертає новий проміс, який виконується, коли всі проміси в масиві успішно виконані.
// Результатом є масив результатів кожного з промісів у тому порядку, в якому вони були передані.

  const paginationData = calculatePaginationData(studentsCount, perPage, page); //буває не у всіх випадках, чисто для підрахунку деяких значень, які треба для тз

  return {
    students,
    ...paginationData,
  };
};

export const getStudentById = async (studentId, userId) => {
    const contact = StudentsCollection.findone({_id: studentId, userId});
    return contact;
};

export const createStudent = async (payload) => {
    const student = await StudentsCollection.create(payload);
    return student;
  };

  export const deleteStudent = async (studentId, userId) => {
    const student = await StudentsCollection.findOneAndDelete({
        _id: studentId,
        userId
      });

      return student;
  };

  export const updateStudent = async(studentId, userId, payload, options = {}) => {
    const rawResult = await StudentsCollection.findOneAndUpdate(
        { _id: studentId, userId },
        payload,
        {
          new: true,
          includeResultMetadata: true,
          ...options,
        },);

        if (!rawResult || !rawResult.value) return null;

        return {
          student: rawResult.value,
          isNew: Boolean(rawResult?.lastErrorObject?.upserted),
        };
  };
