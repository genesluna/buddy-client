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
