export interface TipoUbica {
  dTipoUbica: number;
  descTipoUbica: string;
}

export interface Ubicacion {
  codUbica: string;
  nomUbica: string;
  tipoUbica: number;
  ubica_sup?: string;
}

export interface User {
  codUser: string;
  nombre: string;
  apellido: string;
  genero: string;
  fechaRegistro: string;
  email: string;
  celular: string;
  codUbica: string;
  isEmailValidated: boolean;
}

export interface RegistrationFormData {
  nombre: string;
  apellido: string;
  genero: string;
  email: string;
  celular: string;
  codUbica: string;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  user?: User;
  pdfUrl?: string;
}