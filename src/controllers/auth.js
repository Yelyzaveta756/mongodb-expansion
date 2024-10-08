import { registerUser, loginUser, logoutUser, refreshUsersSession, requestResetToken, resetPassword, verify, loginOrSignupWithGoogle } from '../services/auth.js';
import { ONE_DAY } from '../constants/index.js';
import { generateAuthUrl } from '../utils/googleOAuth2.js';

const setupSession = (res, session) => {
    res.cookie("refreshToken", session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_DAY),
      });

      res.cookie("sessionId", session._id, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_DAY),
      });
};

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
    const session = await loginUser(req.body);

    setupSession(res, session);

      res.json({
        status: 200,
        message: 'Successfully logged in an user!',
        data: {
          accessToken: session.accessToken,
        },
      });
  };

  export const refreshUserSessionController = async (req, res) => {
    const session = await refreshUsersSession({
      sessionId: req.cookies.sessionId,
      refreshToken: req.cookies.refreshToken,
    });

    setupSession(res, session);

    res.json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: session.accessToken,
      },
    });
  };

  export const logoutUserController = async (req, res) => {
    if (req.cookies.sessionId) {
      await logoutUser(req.cookies.sessionId);
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();
  };

  export const requestResetEmailController = async (req, res) => {
    const { email } = req.body;
    await requestResetToken(email);
    res.json({
      message: 'Reset password email was successfully sent!',
      status: 200,
      data: {},
    });
  };

  export const resetPasswordController = async (req, res) => {
    await resetPassword(req.body);
    res.json({
      message: 'Password was successfully reset!',
      status: 200,
      data: {},
    });
  };

  export const verifyController = async(req, res)=> {
    const {token} = req.query;
    await verify(token);

    res.json({
        status: 200,
        message: "Email verified successfully",
        data: {},
    });
};

export const getGoogleOAuthUrlController = async (req, res) => {
  const url = generateAuthUrl();

  res.status(200).json({
    status: 200,
    message: "Successfully get Google OAuth url!",
    data: {url},
});
};

export const loginWithGoogleController = async (req, res) => {
  const session = await loginOrSignupWithGoogle(req.body.code);
  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in via Google OAuth!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
