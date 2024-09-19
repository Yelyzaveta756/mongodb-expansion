import { StudentsCollection } from "../db/model/students.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";
import { SORT_ORDER } from "../constants/index.js";

export const getAllStudents = async ({
  page = 1,
  perPage= 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id'
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const studentsQuery = StudentsCollection.find();
  const studentsCount = await StudentsCollection.find()
    .merge(studentsQuery)
    .countDocuments();

  const students = await studentsQuery.skip(skip).limit(limit).sort({ [sortBy]: sortOrder }).exec();
  // метод sort дозволяє організувати записи за полем, вказаним у sortBy, у порядку, заданому у sortOrder.

  const paginationData = calculatePaginationData(studentsCount, perPage, page);

  return {
    students,
    ...paginationData,
  };
};

export const getStudentById = async (studentId) => {
    const contact = StudentsCollection.findById(studentId);
    return contact;
};

export const createStudent = async (payload) => {
    const student = await StudentsCollection.create(payload);
    return student;
  };

  export const deleteStudent = async (studentId) => {
    const student = await StudentsCollection.findOneAndDelete({
        _id: studentId,
      });

      return student;
  };

  export const updateStudent = async(studentId, payload, options = {}) => {
    const rawResult = await StudentsCollection.findOneAndUpdate(
        { _id: studentId },
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
