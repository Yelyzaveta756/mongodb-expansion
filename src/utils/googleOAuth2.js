import { readFile } from 'fs/promises';
import { OAuth2Client } from 'google-auth-library';
import createHttpError from 'http-errors';
import path from 'node:path';

import { env } from './env.js';

const PATH_JSON = path.join(process.cwd(), 'google-oauth.json');

const oauthConfig = JSON.parse(await readFile(PATH_JSON));

const googleOAuthClient = new OAuth2Client({ // створення клієнта OAuth 2.0.
  clientId: env('GOOGLE_AUTH_CLIENT_ID'),
  clientSecret: env('GOOGLE_AUTH_CLIENT_SECRET'),
  redirectUri: oauthConfig.web.redirect_uris[0], //куди повернутися
});

// Створення URL-адресу, яка використовуватиметься для діалогового вікна підтвердження.
export const generateAuthUrl = () =>
  googleOAuthClient.generateAuthUrl({
      // set the appropriate scopes (сфери застосування)
    scope: [ // що передати
      'https://www.googleapis.com/auth/userinfo.email', //  доступ до електронної адреси користувача.
      'https://www.googleapis.com/auth/userinfo.profile', // доступ до загальної інформації профілю (ім'я, фото тощо).
    ],
  });
    // After authentication
  // we have the code, use that to acquire tokens.
  export const validateCode = async (code) => {
     // Verify the id_token, and access the claims.
    const response = await googleOAuthClient.getToken(code);
    if (!response.tokens.id_token) throw createHttpError(401, 'Unauthorized'); //response.tokens.id_token - jwt token

    const ticket = await googleOAuthClient.verifyIdToken({ // розшифровка токена (так званий "квиток" — ticket)
      idToken: response.tokens.id_token,
    });
    return ticket;
  };

  export const getFullNameFromGoogleTokenPayload = (payload) => { // Функція отримує повне ім'я користувача з інформації, яка була надана Google через токен (payload).
    let fullName = 'Guest';
    if (payload.given_name && payload.family_name) {
      fullName = `${payload.given_name} ${payload.family_name}`;
    } else if (payload.given_name) {
      fullName = payload.given_name;
    }

    return fullName;
  };

//   Що відбувається в цьому коді:
// Користувач проходить аутентифікацію через Google OAuth 2.0.
// Отриманий код аутентифікації надсилається на сервер.
// На сервері код використовують для отримання JWT токена, який містить інформацію про користувача.
// Токен перевіряється на справжність, і отримується інформація про користувача.
// Ця інформація може бути використана для реєстрації або входу користувача в систему.
