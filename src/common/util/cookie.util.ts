import { Response } from 'express';

export const setAuthCookies = (res: Response, tokens: any) => {
  res.cookie('accessToken', tokens.accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  });

  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  });
};
