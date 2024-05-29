type ILoginResponse =
  | {
      token: string;
      refreshToken: string;
    }
  | undefined;

type IRegisterResponse =
  | {
      user: IUser;
    }
  | undefined;

type IRegisterRequest = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type ICheckAccountExited =
  | {
      isExited: boolean;
    }
  | undefined;

type IRefreshTokenType =
  | {
      refreshToken: string;
    }
  | undefined;
