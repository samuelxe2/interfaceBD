import React, { useState, useEffect } from 'react';
import { User, Ubicacion, RegistrationFormData } from '../types';
import { 
  fetchCountries, 
  fetchDepartments,
  fetchCities,
  fetchAreas,
  validateEmail, 
  registerUser, 
  sendEmailNotification,
  getCountryPhoneCode,
  getDepartmentLabel,
  getFullLocationPath,
  getLocationTypeDescription
} from '../services/api';
import { generateRegistrationPDF, downloadPDF } from '../utils/pdfGenerator';
import { Check, AlertCircle, Loader2, Download, Mail, FileText, MapPin } from 'lucide-react';

const RegistrationForm: React.FC = () => {
  const [countries, setCountries] = useState<Ubicacion[]>([]);
  const [departments, setDepartments] = useState<Ubicacion[]>([]);
  const [cities, setCities] = useState<Ubicacion[]>([]);
  const [areas, setAreas] = useState<Ubicacion[]>([]);
  
  const [formData, setFormData] = useState<RegistrationFormData>({
    nombre: '',
    apellido: '',
    genero: '',
    email: '',
    celular: '',
    codUbica: ''
  });
  
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');
  
  const [isEmailValidated, setIsEmailValidated] = useState(false);
  const [isEmailValidating, setIsEmailValidating] = useState(false);
  const [emailValidationMessage, setEmailValidationMessage] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState<{
    isSubmitting: boolean;
    success?: boolean;
    message?: string;
    user?: User;
    pdfUrl?: string;
  }>({
    isSubmitting: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({
    nombre: '',
    apellido: '',
    genero: '',
    email: '',
    celular: '',
    codUbica: ''
  });

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const data = await fetchCountries();
        setCountries(data);
      } catch (error) {
        console.error('Failed to fetch countries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCountries();
  }, []);

  useEffect(() => {
    const loadDepartments = async () => {
      if (selectedCountry) {
        try {
          const data = await fetchDepartments(selectedCountry);
          setDepartments(data);
          setSelectedDepartment('');
          setCities([]);
          setAreas([]);
          setSelectedCity('');
          setSelectedArea('');
          setFormData(prev => ({ ...prev, codUbica: '' }));
        } catch (error) {
          console.error('Failed to fetch departments:', error);
        }
      } else {
        setDepartments([]);
        setCities([]);
        setAreas([]);
      }
    };

    loadDepartments();
  }, [selectedCountry]);

  useEffect(() => {
    const loadCities = async () => {
      if (selectedDepartment) {
        try {
          const data = await fetchCities(selectedDepartment);
          setCities(data);
          setSelectedCity('');
          setAreas([]);
          setSelectedArea('');
          setFormData(prev => ({ ...prev, codUbica: '' }));
        } catch (error) {
          console.error('Failed to fetch cities:', error);
        }
      } else {
        setCities([]);
        setAreas([]);
      }
    };

    loadCities();
  }, [selectedDepartment]);

  useEffect(() => {
    const loadAreas = async () => {
      if (selectedCity) {
        try {
          const data = await fetchAreas(selectedCity);
          setAreas(data);
          setSelectedArea('');
          // If no areas available, use city as final location
          if (data.length === 0) {
            setFormData(prev => ({ ...prev, codUbica: selectedCity }));
          } else {
            setFormData(prev => ({ ...prev, codUbica: '' }));
          }
        } catch (error) {
          console.error('Failed to fetch areas:', error);
        }
      } else {
        setAreas([]);
      }
    };

    loadAreas();
  }, [selectedCity]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'email' && isEmailValidated) {
      setIsEmailValidated(false);
      setEmailValidationMessage('');
    }
    
    if (name === 'selectedCountry') {
      setSelectedCountry(value);
      const phoneCode = getCountryPhoneCode(value);
      setFormData(prev => ({ 
        ...prev, 
        celular: phoneCode,
        codUbica: ''
      }));
    } else if (name === 'selectedDepartment') {
      setSelectedDepartment(value);
    } else if (name === 'selectedCity') {
      setSelectedCity(value);
    } else if (name === 'selectedArea') {
      setSelectedArea(value);
      setFormData(prev => ({ ...prev, codUbica: value }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleValidateEmail = async () => {
    if (!formData.email) {
      setErrors((prev) => ({
        ...prev,
        email: 'Email is required',
      }));
      return;
    }
    
    setIsEmailValidating(true);
    try {
      const { valid, message } = await validateEmail(formData.email);
      setIsEmailValidated(valid);
      setEmailValidationMessage(message);
      
      if (!valid) {
        setErrors((prev) => ({
          ...prev,
          email: message,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          email: '',
        }));
      }
    } catch (error) {
      console.error('Email validation failed:', error);
      setEmailValidationMessage('Validation failed. Please try again.');
    } finally {
      setIsEmailValidating(false);
    }
  };

  const validateForm = () => {
    const newErrors = {
      nombre: formData.nombre ? '' : 'First name is required',
      apellido: formData.apellido ? '' : 'Last name is required',
      genero: formData.genero ? '' : 'Gender is required',
      email: formData.email ? '' : 'Email is required',
      celular: formData.celular ? '' : 'Phone number is required',
      codUbica: formData.codUbica ? '' : 'Please complete location selection'
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !isEmailValidated) {
      if (!isEmailValidated) {
        setEmailValidationMessage('Please validate your email first');
      }
      return;
    }
    
    setRegistrationStatus({ isSubmitting: true });
    
    try {
      const result = await registerUser(formData);
      
      if (result.success && result.user) {
        const pdfUrl = await generateRegistrationPDF(result.user);
        await sendEmailNotification(result.user.email, `${result.user.nombre} ${result.user.apellido}`);
        
        setRegistrationStatus({
          isSubmitting: false,
          success: result.success,
          message: result.message,
          user: result.user,
          pdfUrl: pdfUrl,
        });
        
        // Reset form
        setFormData({
          nombre: '',
          apellido: '',
          genero: '',
          email: '',
          celular: '',
          codUbica: ''
        });
        setSelectedCountry('');
        setSelectedDepartment('');
        setSelectedCity('');
        setSelectedArea('');
        setIsEmailValidated(false);
        setEmailValidationMessage('');
      } else {
        setRegistrationStatus({
          isSubmitting: false,
          success: false,
          message: result.message,
        });
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setRegistrationStatus({
        isSubmitting: false,
        success: false,
        message: 'Registration failed. Please try again.',
      });
    }
  };

  const handleDownloadPDF = () => {
    if (registrationStatus.pdfUrl && registrationStatus.user) {
      downloadPDF(registrationStatus.pdfUrl, `registration-${registrationStatus.user.codUser}.pdf`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  const selectedCountryData = countries.find(country => country.codUbica === selectedCountry);
  const departmentLabel = selectedCountry ? getDepartmentLabel(selectedCountry) : 'Región';

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden transition-all">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 text-white">
        <h2 className="text-xl font-semibold">User Registration</h2>
        <p className="text-blue-100 text-sm">Create your account with complete location information</p>
      </div>
      
      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
        {/* Personal Information Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.nombre ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your first name"
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.nombre}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.apellido ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your last name"
              />
              {errors.apellido && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.apellido}
                </p>
              )}
            </div>
          </div>

          {/* Gender */}
          <div className="mt-4">
            <label htmlFor="genero" className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              id="genero"
              name="genero"
              value={formData.genero}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.genero ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select your gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
            {errors.genero && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.genero}
              </p>
            )}
          </div>
        </div>

        {/* Location Information Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <MapPin className="h-5 w-5 text-green-600" />
            </div>
            Location Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Country Selection - País */}
            <div>
              <label htmlFor="selectedCountry" className="block text-sm font-medium text-gray-700 mb-1">
                País (Country)
              </label>
              <select
                id="selectedCountry"
                name="selectedCountry"
                value={selectedCountry}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <option value="">Select your country</option>
                {countries.map((country) => (
                  <option key={country.codUbica} value={country.codUbica}>
                    {country.nomUbica} ({getCountryPhoneCode(country.codUbica)})
                  </option>
                ))}
              </select>
            </div>

            {/* Department/Province Selection - Departamento/Provincia */}
            {selectedCountry && (
              <div>
                <label htmlFor="selectedDepartment" className="block text-sm font-medium text-gray-700 mb-1">
                  {departmentLabel}
                </label>
                <select
                  id="selectedDepartment"
                  name="selectedDepartment"
                  value={selectedDepartment}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <option value="">Select your {departmentLabel.toLowerCase()}</option>
                  {departments.map((department) => (
                    <option key={department.codUbica} value={department.codUbica}>
                      {department.nomUbica}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* City Selection - Ciudad */}
            {selectedDepartment && (
              <div>
                <label htmlFor="selectedCity" className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad (City)
                </label>
                <select
                  id="selectedCity"
                  name="selectedCity"
                  value={selectedCity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <option value="">Select your city</option>
                  {cities.map((city) => (
                    <option key={city.codUbica} value={city.codUbica}>
                      {city.nomUbica}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Area Selection - Area */}
            {selectedCity && areas.length > 0 && (
              <div>
                <label htmlFor="selectedArea" className="block text-sm font-medium text-gray-700 mb-1">
                  Area (Area/Neighborhood)
                </label>
                <select
                  id="selectedArea"
                  name="selectedArea"
                  value={selectedArea}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.codUbica ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select your area</option>
                  {areas.map((area) => (
                    <option key={area.codUbica} value={area.codUbica}>
                      {area.nomUbica}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Location Preview */}
          {formData.codUbica && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Selected Location:</strong> {getFullLocationPath(formData.codUbica)}
              </p>
            </div>
          )}

          {errors.codUbica && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.codUbica}
            </p>
          )}
        </div>

        {/* Contact Information Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <div className="bg-purple-100 p-2 rounded-full mr-3">
              <Mail className="h-5 w-5 text-purple-600" />
            </div>
            Contact Information
          </h3>

          {/* Phone Number */}
          <div className="mb-4">
            <label htmlFor="celular" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="celular"
              name="celular"
              value={formData.celular}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.celular ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your phone number"
            />
            {errors.celular && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.celular}
              </p>
            )}
          </div>
          
          {/* Email Field with Validation */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="flex space-x-2">
              <div className="flex-grow">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.email ? 'border-red-500' : isEmailValidated ? 'border-green-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                  disabled={isEmailValidated}
                />
              </div>
              <button
                type="button"
                onClick={handleValidateEmail}
                disabled={isEmailValidating || isEmailValidated}
                className={`px-4 py-2 rounded-md text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isEmailValidated
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isEmailValidating ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : isEmailValidated ? (
                  <Check className="h-5 w-5" />
                ) : (
                  'Validate'
                )}
              </button>
            </div>
            
            {emailValidationMessage && (
              <p className={`mt-1 text-sm flex items-center ${
                isEmailValidated ? 'text-green-600' : 'text-red-600'
              }`}>
                {isEmailValidated ? (
                  <Check className="h-4 w-4 mr-1" />
                ) : (
                  <AlertCircle className="h-4 w-4 mr-1" />
                )}
                {emailValidationMessage}
              </p>
            )}
            
            {errors.email && !emailValidationMessage && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.email}
              </p>
            )}
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isEmailValidated || registrationStatus.isSubmitting}
          className={`w-full px-4 py-3 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            !isEmailValidated
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {registrationStatus.isSubmitting ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Registering...
            </div>
          ) : (
            'Register'
          )}
        </button>
        
        {/* Registration Status Message */}
        {registrationStatus.message && (
          <div className={`p-4 mt-4 rounded-md ${
            registrationStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {registrationStatus.success ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{registrationStatus.message}</p>
                
                {/* Success Actions */}
                {registrationStatus.success && registrationStatus.user && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handleDownloadPDF}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </button>
                      
                      <div className="flex items-center text-sm text-green-600">
                        <Mail className="h-4 w-4 mr-1" />
                        Email sent to {registrationStatus.user.email}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
                      <div className="flex items-center mb-2">
                        <FileText className="h-4 w-4 mr-2" />
                        <span className="font-medium">Registration Details:</span>
                      </div>
                      <p>User ID: {registrationStatus.user.codUser}</p>
                      <p>Name: {registrationStatus.user.nombre} {registrationStatus.user.apellido}</p>
                      <p>Location: {getFullLocationPath(registrationStatus.user.codUbica)}</p>
                      <p>Registration Date: {registrationStatus.user.fechaRegistro}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default RegistrationForm;