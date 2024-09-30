import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerUserSchema, loginUserSchema, requestResetEmailSchema } from '../validation/auth.js';
import { registerUserController, loginUserController, logoutUserController, refreshUserSessionController, requestResetEmailController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';

export const authRouter = Router();

authRouter.post('/register', validateBody(registerUserSchema), ctrlWrapper(registerUserController));
authRouter.post('/login', validateBody(loginUserSchema), ctrlWrapper(loginUserController));
authRouter.post('/logout', ctrlWrapper(logoutUserController));
authRouter.post('/refresh', ctrlWrapper(refreshUserSessionController));
authRouter.post('/request-reset-email', validateBody(requestResetEmailSchema), ctrlWrapper(requestResetEmailController));

