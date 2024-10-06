import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerUserSchema, loginUserSchema, requestResetEmailSchema, resetPasswordSchema, loginWithGoogleOAuthSchema } from '../validation/auth.js';
import {
    registerUserController,
    loginUserController,
    logoutUserController,
    refreshUserSessionController,
    requestResetEmailController,
    resetPasswordController,
    verifyController,
    getGoogleOAuthUrlController,
    loginWithGoogleController
 } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';

export const authRouter = Router();

authRouter.post('/register', validateBody(registerUserSchema), ctrlWrapper(registerUserController));
authRouter.post('/login', validateBody(loginUserSchema), ctrlWrapper(loginUserController));
authRouter.post('/logout', ctrlWrapper(logoutUserController));
authRouter.post('/refresh', ctrlWrapper(refreshUserSessionController));
authRouter.post('/request-reset-email', validateBody(requestResetEmailSchema), ctrlWrapper(requestResetEmailController));
authRouter.post('/reset-password', validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));
authRouter.post('/verify', ctrlWrapper(verifyController));
authRouter.get('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController)); // отримання посилання авторизації.
authRouter.post('/confirm-google-auth',  validateBody(loginWithGoogleOAuthSchema), ctrlWrapper(loginWithGoogleController)); // авторизація



