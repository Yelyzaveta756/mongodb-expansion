import createHttpError from "http-errors";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { TEMPLATES_DIR } from "../constants/index.js";
import { SMTP } from '../constants/index.js';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';
import { randomBytes } from "crypto";
import { UsersCollection } from "../db/model/users.js";
import { SessionsCollection } from "../db/model/session.js";
import { FIFTEEN_MINUTES, ONE_DAY } from "../constants/index.js";
import { createJwtToken } from "../utils/jwt.js";
import { verifyToken } from "../utils/jwt.js";
import { getFullNameFromGoogleTokenPayload, validateCode } from "../utils/googleOAuth2.js";

const createSession = ()=> {
    const accessToken = randomBytes(30).toString("base64");
    const refreshToken = randomBytes(30).toString("base64");
    const accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES);
    const refreshTokenValidUntil = new Date(Date.now() + ONE_DAY);

    return {
        accessToken,
        refreshToken,
        accessTokenValidUntil,
        refreshTokenValidUntil,
    };
};

export const registerUser = async (payload) => {
    const { email, password } = payload;
    const user = await UsersCollection.findOne({ email });
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(password, 10);

  const token = createJwtToken(email);

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="http://localhost:3001/auth/verify?token=${token}">Click here to verify</a>`
  };

  await sendEmail(verifyEmail);

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
  };

  export const loginUser = async (payload) => {
    const { email, password } = payload;
    const user = await UsersCollection.findOne({ email });

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const isEqual = await bcrypt.compare(password, user.password); // Порівнюємо хеші паролів

    if (!isEqual) {
      throw createHttpError(401, 'Unauthorized');
    }

    await SessionsCollection.deleteOne({ userId: user._id });

    const sessionData = createSession();

    const userSession = await SessionsCollection.create({
        userId: user._id,
        ...sessionData,
    });

    return userSession;
  };

  export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
    const session = await SessionsCollection.findOne({
      _id: sessionId,
      refreshToken,
    });

    if (!session) {
      throw createHttpError(401, 'Session not found');
    }

    const isSessionTokenExpired =
      new Date() > new Date(session.refreshTokenValidUntil);

    if (isSessionTokenExpired) {
      throw createHttpError(401, 'Session token expired');
    }

    const newSession = createSession();

    await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

    return await SessionsCollection.create({
      userId: session.userId,
      ...newSession,
    });
  };

  export const logoutUser = async (sessionId) => {
    await SessionsCollection.deleteOne({ _id: sessionId });
  };

  export const requestResetToken = async (email) => {
    const user = await UsersCollection.findOne({ email });
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const resetToken = jwt.sign(
      {
        sub: user._id,
        email,
      },
      env('JWT_SECRET'),
      {
        expiresIn: '15m',
      },
    );

    // const decodeToken =jwt.decode(resetToken);
    // console.log(decodeToken);

    const resetPasswordTemplatePath = path.join(
      TEMPLATES_DIR,
      'reset-password-email.html',
    ); // посилання до html файлу

    // console.log(resetPasswordTemplatePath);

    const templateSource = (
      await fs.readFile(resetPasswordTemplatePath)
    ).toString();

    const template = handlebars.compile(templateSource);
    const html = template({
      name: user.name,
      link: `${env("APP_DOMAIN")}/reset-password?token=${resetToken}`,
    });

    await sendEmail({
      from: env(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  };

  export const resetPassword = async (payload) => {
    let entries;

    try {
      entries = jwt.verify(payload.token, env('JWT_SECRET'));
    } catch (err) {
      if (err instanceof Error) throw createHttpError(401, err.message);
      throw err;
    }

    const user = await UsersCollection.findOne({
      email: entries.email,
      _id: entries.sub,
    });

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const encryptedPassword = await bcrypt.hash(payload.password, 10);

    await UsersCollection.updateOne(
      { _id: user._id },
      { password: encryptedPassword },
    );
  };

  export const verify = async token => {
    const {data, error} = verifyToken(token);
    if(error) {
        throw createHttpError(401, "Token invalid");
    }

    const user = await UsersCollection.findOne({email: data.email});
    if(user.verify) {
        throw createHttpError(401, "Email already verify");
    }

    await UsersCollection.findOneAndUpdate({_id: user._id}, {verify: true});

};

export const loginOrSignupWithGoogle = async (code) => {
  const loginTicket = await validateCode(code); // отримує id_token для аутентифікації через Google.
  const payload = loginTicket.getPayload(); // повертає код, який використовується для отримання інформації про користувача.
  if (!payload) throw createHttpError(401);

  let user = await UsersCollection.findOne({ email: payload.email }); // знаходимо користувача по email
  if (!user) { // перевірка чи такий користувач є
    const password = await bcrypt.hash(randomBytes(10), 10);
    user = await UsersCollection.create({ // створюємо нового користувача якщо наявного немає
      email: payload.email,
      name: getFullNameFromGoogleTokenPayload(payload),
      password,
      role: 'parent',
    });
  }

  const newSession = createSession(); // створення сесії

  return await SessionsCollection.create({
    userId: user._id,
    ...newSession,
  });
};
