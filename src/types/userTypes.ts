export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
}

export interface UserProps {
  id: string;
  role: 'user';
  fullName?: string;
}
