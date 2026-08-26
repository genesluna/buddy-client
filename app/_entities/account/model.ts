export interface AccountRequest {
  email: string;
  phoneNumber: string;
  password: string;
  termsOfUserConsent: boolean;
}

export interface ConfirmEmailRequest {
  token: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}
