import { StudentsCollection } from "../db/model/students.js";

export const getAllStudents = async () => {
    const contacts = StudentsCollection.find();
    return contacts;
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
