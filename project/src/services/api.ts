import { TipoUbica, Ubicacion, User, RegistrationFormData, RegistrationResponse } from '../types';

// Updated database of location types using your specified format
const tipoUbicas: TipoUbica[] = [
  { dTipoUbica: 1, descTipoUbica: 'País' },
  { dTipoUbica: 2, descTipoUbica: 'Departamento' },
  { dTipoUbica: 3, descTipoUbica: 'Ciudad' },
  { dTipoUbica: 4, descTipoUbica: 'Area' },
  { dTipoUbica: 5, descTipoUbica: 'Provincia' }
];

// Enhanced simulated database of locations with hierarchical structure
const ubicaciones: Ubicacion[] = [
  // Countries (País - Type 1)
  { codUbica: '57', nomUbica: 'Colombia', tipoUbica: 1 },
  { codUbica: '1', nomUbica: 'Estados Unidos', tipoUbica: 1 },
  { codUbica: '34', nomUbica: 'España', tipoUbica: 1 },
  { codUbica: '54', nomUbica: 'Argentina', tipoUbica: 1 },
  { codUbica: '52', nomUbica: 'México', tipoUbica: 1 },
  
  // Colombia - Departamentos (Departamento - Type 2)
  { codUbica: '5705', nomUbica: 'Antioquia', tipoUbica: 2, ubica_sup: '57' },
  { codUbica: '5781', nomUbica: 'Arauca', tipoUbica: 2, ubica_sup: '57' },
  { codUbica: '5711', nomUbica: 'Bogotá D.C.', tipoUbica: 2, ubica_sup: '57' },
  { codUbica: '5715', nomUbica: 'Boyacá', tipoUbica: 2, ubica_sup: '57' },
  { codUbica: '5725', nomUbica: 'Cundinamarca', tipoUbica: 2, ubica_sup: '57' },
  { codUbica: '5776', nomUbica: 'Valle del Cauca', tipoUbica: 2, ubica_sup: '57' },
  
  // USA - Provincias (Provincia - Type 5)
  { codUbica: '1001', nomUbica: 'Alabama', tipoUbica: 5, ubica_sup: '1' },
  { codUbica: '1002', nomUbica: 'Alaska', tipoUbica: 5, ubica_sup: '1' },
  { codUbica: '1003', nomUbica: 'Arizona', tipoUbica: 5, ubica_sup: '1' },
  { codUbica: '1004', nomUbica: 'California', tipoUbica: 5, ubica_sup: '1' },
  { codUbica: '1005', nomUbica: 'Florida', tipoUbica: 5, ubica_sup: '1' },
  { codUbica: '1006', nomUbica: 'New York', tipoUbica: 5, ubica_sup: '1' },
  { codUbica: '1007', nomUbica: 'Texas', tipoUbica: 5, ubica_sup: '1' },
  
  // Spain - Provincias (Provincia - Type 5)
  { codUbica: '3428', nomUbica: 'Madrid', tipoUbica: 5, ubica_sup: '34' },
  { codUbica: '3408', nomUbica: 'Barcelona', tipoUbica: 5, ubica_sup: '34' },
  { codUbica: '3441', nomUbica: 'Sevilla', tipoUbica: 5, ubica_sup: '34' },
  { codUbica: '3446', nomUbica: 'Valencia', tipoUbica: 5, ubica_sup: '34' },
  
  // Argentina - Provincias (Provincia - Type 5)
  { codUbica: '5401', nomUbica: 'Buenos Aires', tipoUbica: 5, ubica_sup: '54' },
  { codUbica: '5402', nomUbica: 'Córdoba', tipoUbica: 5, ubica_sup: '54' },
  { codUbica: '5403', nomUbica: 'Santa Fe', tipoUbica: 5, ubica_sup: '54' },
  { codUbica: '5404', nomUbica: 'Mendoza', tipoUbica: 5, ubica_sup: '54' },
  
  // México - Provincias (Provincia - Type 5)
  { codUbica: '5201', nomUbica: 'Ciudad de México', tipoUbica: 5, ubica_sup: '52' },
  { codUbica: '5202', nomUbica: 'Jalisco', tipoUbica: 5, ubica_sup: '52' },
  { codUbica: '5203', nomUbica: 'Nuevo León', tipoUbica: 5, ubica_sup: '52' },
  { codUbica: '5204', nomUbica: 'Yucatán', tipoUbica: 5, ubica_sup: '52' },
  
  // Antioquia - Ciudades (Ciudad - Type 3)
  { codUbica: '570501', nomUbica: 'Medellín', tipoUbica: 3, ubica_sup: '5705' },
  { codUbica: '570502', nomUbica: 'Bello', tipoUbica: 3, ubica_sup: '5705' },
  { codUbica: '570503', nomUbica: 'Itagüí', tipoUbica: 3, ubica_sup: '5705' },
  { codUbica: '570504', nomUbica: 'Envigado', tipoUbica: 3, ubica_sup: '5705' },
  { codUbica: '570505', nomUbica: 'Sabaneta', tipoUbica: 3, ubica_sup: '5705' },
  { codUbica: '570506', nomUbica: 'Rionegro', tipoUbica: 3, ubica_sup: '5705' },
  
  // Bogotá - Ciudades (Ciudad - Type 3)
  { codUbica: '571101', nomUbica: 'Bogotá', tipoUbica: 3, ubica_sup: '5711' },
  { codUbica: '571102', nomUbica: 'Soacha', tipoUbica: 3, ubica_sup: '5711' },
  { codUbica: '571103', nomUbica: 'Chía', tipoUbica: 3, ubica_sup: '5711' },
  
  // Valle del Cauca - Ciudades (Ciudad - Type 3)
  { codUbica: '577601', nomUbica: 'Cali', tipoUbica: 3, ubica_sup: '5776' },
  { codUbica: '577602', nomUbica: 'Palmira', tipoUbica: 3, ubica_sup: '5776' },
  { codUbica: '577603', nomUbica: 'Buenaventura', tipoUbica: 3, ubica_sup: '5776' },
  
  // California - Ciudades (Ciudad - Type 3)
  { codUbica: '100401', nomUbica: 'Los Angeles', tipoUbica: 3, ubica_sup: '1004' },
  { codUbica: '100402', nomUbica: 'San Francisco', tipoUbica: 3, ubica_sup: '1004' },
  { codUbica: '100403', nomUbica: 'San Diego', tipoUbica: 3, ubica_sup: '1004' },
  { codUbica: '100404', nomUbica: 'Sacramento', tipoUbica: 3, ubica_sup: '1004' },
  
  // New York - Ciudades (Ciudad - Type 3)
  { codUbica: '100601', nomUbica: 'New York City', tipoUbica: 3, ubica_sup: '1006' },
  { codUbica: '100602', nomUbica: 'Buffalo', tipoUbica: 3, ubica_sup: '1006' },
  { codUbica: '100603', nomUbica: 'Rochester', tipoUbica: 3, ubica_sup: '1006' },
  
  // Madrid - Ciudades (Ciudad - Type 3)
  { codUbica: '342801', nomUbica: 'Madrid', tipoUbica: 3, ubica_sup: '3428' },
  { codUbica: '342802', nomUbica: 'Móstoles', tipoUbica: 3, ubica_sup: '3428' },
  { codUbica: '342803', nomUbica: 'Alcalá de Henares', tipoUbica: 3, ubica_sup: '3428' },
  
  // Buenos Aires - Ciudades (Ciudad - Type 3)
  { codUbica: '540101', nomUbica: 'Buenos Aires', tipoUbica: 3, ubica_sup: '5401' },
  { codUbica: '540102', nomUbica: 'La Plata', tipoUbica: 3, ubica_sup: '5401' },
  { codUbica: '540103', nomUbica: 'Mar del Plata', tipoUbica: 3, ubica_sup: '5401' },
  
  // Medellín - Areas (Area - Type 4)
  { codUbica: '57050101', nomUbica: 'El Poblado', tipoUbica: 4, ubica_sup: '570501' },
  { codUbica: '57050102', nomUbica: 'Laureles', tipoUbica: 4, ubica_sup: '570501' },
  { codUbica: '57050103', nomUbica: 'Belén', tipoUbica: 4, ubica_sup: '570501' },
  { codUbica: '57050104', nomUbica: 'La Candelaria', tipoUbica: 4, ubica_sup: '570501' },
  { codUbica: '57050105', nomUbica: 'Buenos Aires', tipoUbica: 4, ubica_sup: '570501' },
  { codUbica: '57050106', nomUbica: 'Manrique', tipoUbica: 4, ubica_sup: '570501' },
  
  // Bogotá - Areas (Area - Type 4)
  { codUbica: '57110101', nomUbica: 'Chapinero', tipoUbica: 4, ubica_sup: '571101' },
  { codUbica: '57110102', nomUbica: 'Zona Rosa', tipoUbica: 4, ubica_sup: '571101' },
  { codUbica: '57110103', nomUbica: 'La Candelaria', tipoUbica: 4, ubica_sup: '571101' },
  { codUbica: '57110104', nomUbica: 'Usaquén', tipoUbica: 4, ubica_sup: '571101' },
  { codUbica: '57110105', nomUbica: 'Suba', tipoUbica: 4, ubica_sup: '571101' },
  
  // Los Angeles - Areas (Area - Type 4)
  { codUbica: '10040101', nomUbica: 'Hollywood', tipoUbica: 4, ubica_sup: '100401' },
  { codUbica: '10040102', nomUbica: 'Beverly Hills', tipoUbica: 4, ubica_sup: '100401' },
  { codUbica: '10040103', nomUbica: 'Santa Monica', tipoUbica: 4, ubica_sup: '100401' },
  { codUbica: '10040104', nomUbica: 'Downtown LA', tipoUbica: 4, ubica_sup: '100401' },
  
  // Madrid - Areas (Area - Type 4)
  { codUbica: '34280101', nomUbica: 'Centro', tipoUbica: 4, ubica_sup: '342801' },
  { codUbica: '34280102', nomUbica: 'Salamanca', tipoUbica: 4, ubica_sup: '342801' },
  { codUbica: '34280103', nomUbica: 'Chamberí', tipoUbica: 4, ubica_sup: '342801' },
  { codUbica: '34280104', nomUbica: 'Retiro', tipoUbica: 4, ubica_sup: '342801' },
  
  // Buenos Aires - Areas (Area - Type 4)
  { codUbica: '54010101', nomUbica: 'Palermo', tipoUbica: 4, ubica_sup: '540101' },
  { codUbica: '54010102', nomUbica: 'Recoleta', tipoUbica: 4, ubica_sup: '540101' },
  { codUbica: '54010103', nomUbica: 'San Telmo', tipoUbica: 4, ubica_sup: '540101' },
  { codUbica: '54010104', nomUbica: 'Puerto Madero', tipoUbica: 4, ubica_sup: '540101' }
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
    codUbica: '10040101', 
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
    codUbica: '57050101', 
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

export const fetchDepartments = async (countryCode: string): Promise<Ubicacion[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const departments = ubicaciones.filter(ubicacion => 
        (ubicacion.tipoUbica === 2 || ubicacion.tipoUbica === 5) && 
        ubicacion.ubica_sup === countryCode
      );
      resolve(departments);
    }, 500);
  });
};

export const fetchCities = async (departmentCode: string): Promise<Ubicacion[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const cities = ubicaciones.filter(ubicacion => 
        ubicacion.tipoUbica === 3 && 
        ubicacion.ubica_sup === departmentCode
      );
      resolve(cities);
    }, 500);
  });
};

export const fetchAreas = async (cityCode: string): Promise<Ubicacion[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const areas = ubicaciones.filter(ubicacion => 
        ubicacion.tipoUbica === 4 && 
        ubicacion.ubica_sup === cityCode
      );
      resolve(areas);
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

export const getLocationTypeDescription = (tipoUbica: number): string => {
  const tipo = tipoUbicas.find(tipo => tipo.dTipoUbica === tipoUbica);
  return tipo ? tipo.descTipoUbica : 'Unknown';
};

export const getFullLocationPath = (codUbica: string): string => {
  const location = ubicaciones.find(ubicacion => ubicacion.codUbica === codUbica);
  if (!location) return 'Unknown';
  
  const path = [location.nomUbica];
  let currentLocation = location;
  
  while (currentLocation.ubica_sup) {
    const parentLocation = ubicaciones.find(ubicacion => ubicacion.codUbica === currentLocation.ubica_sup);
    if (parentLocation) {
      path.unshift(parentLocation.nomUbica);
      currentLocation = parentLocation;
    } else {
      break;
    }
  }
  
  return path.join(' > ');
};

export const getCountryPhoneCode = (countryCode: string): string => {
  const phoneCodeMap: { [key: string]: string } = {
    '57': '+57',
    '1': '+1',
    '34': '+34',
    '54': '+54',
    '52': '+52'
  };
  return phoneCodeMap[countryCode] || '';
};

export const getDepartmentLabel = (countryCode: string): string => {
  const labelMap: { [key: string]: string } = {
    '57': 'Departamento',
    '1': 'Provincia',
    '34': 'Provincia',
    '54': 'Provincia',
    '52': 'Provincia'
  };
  return labelMap[countryCode] || 'Región';
};