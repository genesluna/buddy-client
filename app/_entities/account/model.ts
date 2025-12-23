export interface AccountRequest {
  email: string;
  phoneNumber: string;
  password: string;
  termsOfUseAndPrivacyConsent: boolean;
}

export interface ConfirmEmailRequest {
  token: string;
}

export interface ResendVerificationRequest {
  email: string;
}
