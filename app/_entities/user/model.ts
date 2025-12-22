export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRegistration extends UserCredentials {
  name: string;
  confirmPassword: string;
}
