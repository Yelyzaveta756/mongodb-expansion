import { Schema, model } from 'mongoose';
// Перевірка того що ми зберігаємо

 const studentsSchema = new Schema(
   {
     name: {
       type: String,
       required: true,
     },
     age: {
       type: Number,
       required: true,
     },
     gender: {
       type: String,
       required: true,
       enum: ['male', 'female', 'other'],
     },
     avgMark: {
       type: Number,
       required: true,
     },
     onDuty: {
       type: Boolean,
       required: true,
       default: false,
     },
     userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
  },
      photo: { type: String },
   },
   {
     timestamps: true,
     versionKey: false,
   },
 );

 export const StudentsCollection = model('students', studentsSchema);
