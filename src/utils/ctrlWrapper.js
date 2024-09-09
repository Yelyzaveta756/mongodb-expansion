export const ctrlWrapper = (controller) => {
    return async (req, res, next) => {
      try {
        await controller(req, res, next);
      } catch (err) {
        next(err);
      }
    };
  };

  // Проблема в тому, що нам прийдеться додавати try...catch із шаблонним кодом виклику
// next(err) у кожному контролері. Щоб уникнути повторення коду, створимо допоміжну функцію-обгортку.
