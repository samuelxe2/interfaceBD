import { TipoUbica, Ubicacion, User, RegistrationFormData, RegistrationResponse } from '../types';

// Simulated database of location types
const tipoUbicas: TipoUbica[] = [
  { dTipoUbica: 1, descTipoUbica: 'País' },
  { dTipoUbica: 2, descTipoUbica: 'Departamento' },
  { dTipoUbica: 3, descTipoUbica: 'Ciudad' },
  { dTipoUbica: 4, descTipoUbica: 'Area' },
  { dTipoUbica: 5, descTipoUbica: 'Provincia' }
];

// Simulated database of locations
const ubicaciones: Ubicacion[] = [
  // Countries
  { codUbica: '57', nomUbica: 'Colombia', tipoUbica: 1 },
  { codUbica: '1', nomUbica: 'E.U', tipoUbica: 1 },
  { codUbica: '34', nomUbica: 'España', tipoUbica: 1 },
  { codUbica: '54', nomUbica: 'Argentina', tipoUbica: 1 },
  
  // Departments/States
  { codUbica: '05', nomUbica: 'Antioquia', tipoUbica: 2, ubica_sup: '57' },
  { codUbica: '81', nomUbica: 'Arauca', tipoUbica: 2, ubica_sup: '57' },
  { codUbica: '11', nomUbica: 'Bogotá D.C.', tipoUbica: 2, ubica_sup: '57' },
  { codUbica: '15', nomUbica: 'Boyacá', tipoUbica: 2, ubica_sup: '57' },
  { codUbica: '25', nomUbica: 'Cundinamarca', tipoUbica: 2, ubica_sup: '57' },
  { codUbica: '205', nomUbica: 'Alabama', tipoUbica: 4, ubica_sup: '1' },
  { codUbica: '907', nomUbica: 'Alaska', tipoUbica: 4, ubica_sup: '1' },
  { codUbica: '209', nomUbica: 'California', tipoUbica: 4, ubica_sup: '1' }
];

// Simulated database of users
const users: User[] = [
  { 
    codUser: '1', 
    nombre: 'John', 
    apellido: 'Doe',
    genero: 'M',
    fechaRegistro: '2024-01-15',
    email: 'john@example.com', 
    celular: '+1234567890',
    codUbica: '205', 
    isEmailValidated: true 
  },
  { 
    codUser: '2', 
    nombre: 'Jane', 
    apellido: 'Smith',
    genero: 'F',
    fechaRegistro: '2024-02-20',
    email: 'jane@example.com', 
    celular: '+5712345678',
    codUbica: '11', 
    isEmailValidated: true 
  }
];

export const fetchCountries = async (): Promise<Ubicacion[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const countries = ubicaciones.filter(ubicacion => ubicacion.tipoUbica === 1);
      resolve(countries);
    }, 500);
  });
};

export const fetchRegions = async (countryCode: string): Promise<Ubicacion[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const regions = ubicaciones.filter(ubicacion => ubicacion.ubica_sup === countryCode);
      resolve(regions);
    }, 500);
  });
};

export const validateEmail = async (email: string): Promise<{ valid: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidFormat = emailRegex.test(email);
      const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
      
      if (!isValidFormat) {
        resolve({ valid: false, message: 'Please enter a valid email address.' });
      } else if (existingUser) {
        resolve({ valid: false, message: 'This email is already registered.' });
      } else {
        resolve({ valid: true, message: 'Email Validated' });
      }
    }, 800);
  });
};

export const registerUser = async (userData: RegistrationFormData): Promise<RegistrationResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const existingUser = users.find(user => user.email.toLowerCase() === userData.email.toLowerCase());
      
      if (existingUser) {
        resolve({ 
          success: false, 
          message: 'User with this email already exists.' 
        });
      } else {
        const newUser: User = {
          codUser: (users.length + 1).toString(),
          nombre: userData.nombre,
          apellido: userData.apellido,
          genero: userData.genero,
          fechaRegistro: new Date().toISOString().split('T')[0],
          email: userData.email,
          celular: userData.celular,
          codUbica: userData.codUbica,
          isEmailValidated: true,
        };
        
        users.push(newUser);
        
        resolve({ 
          success: true, 
          message: 'User registered successfully. PDF generated and email notification sent.', 
          user: newUser,
          pdfUrl: `registration-${newUser.codUser}.pdf`
        });
      }
    }, 1000);
  });
};

export const sendEmailNotification = async (email: string, userName: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Email notification sent to ${email} for user ${userName}`);
      resolve(true);
    }, 500);
  });
};

export const getLocationName = (codUbica: string): string => {
  const location = ubicaciones.find(ubicacion => ubicacion.codUbica === codUbica);
  return location ? location.nomUbica : 'Unknown';
};

export const getCountryPhoneCode = (countryCode: string): string => {
  const phoneCodeMap: { [key: string]: string } = {
    '57': '+57',
    '1': '+1',
    '34': '+34',
    '54': '+54'
  };
  return phoneCodeMap[countryCode] || '';
};