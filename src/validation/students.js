// Простий приклад використання
// Перевірка тіла запиту що приходить з фронтенду

import Joi from 'joi';

// export const createStudentSchema = Joi.object({
//   name: Joi.string().min(3).max(30).required(),
// //   email: Joi.string().email().required(),
//   age: Joi.number().integer().min(6).max(16).required(),
//   gender: Joi.string().valid('male', 'female', 'other').required(),
//   avgMark: Joi.number().min(2).max(12).required(),
//   onDuty: Joi.boolean(),
// });

// Оголошення схеми з кастомізованими повідомленнями
export const createStudentSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Username should be a string', // Кастомізація повідомлення для типу "string"
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
    'any.required': 'Username is required',
  }),
  age: Joi.number().integer().min(6).max(40).required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  avgMark: Joi.number().min(2).max(12).required(),
  onDuty: Joi.boolean(),
});

// const dataToValidate = {
//     name: 'John Doe',
//     email: 'john.doe@example.com',
//     age: 12,
//     gender: 'male',
//     avgMark: 10.2,
//   };

//   const validationResult = createStudentSchema.validate(dataToValidate, {
//      abortEarly: false,
//   });
//   if (validationResult.error) {
//     console.error(validationResult.error.message);
//   } else {
//     console.log('Data is valid!');
//   }

export const updateStudentSchema = Joi.object({
    name: Joi.string().min(3).max(30),
    age: Joi.number().integer().min(6).max(40),
    gender: Joi.string().valid('male', 'female', 'other'),
    avgMark: Joi.number().min(2).max(12),
    onDuty: Joi.boolean(),
  });

//   Різниця між схемами полягає у тому, що у схемі для оновлення користувача всі поля є необовʼязковими,
// на відміну від схеми при створенні користувача.

