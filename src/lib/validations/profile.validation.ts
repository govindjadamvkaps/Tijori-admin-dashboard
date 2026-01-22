// lib/validations/profile.validation.ts
import * as Yup from 'yup';

export const updateProfileSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces')
    .required('Full name is required'),
  
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  
  phone: Yup.object().shape({
    country_code: Yup.string()
      .matches(/^\+\d{1,4}$/, 'Invalid country code format (e.g., +965)')
      .required('Country code is required'),
    number: Yup.string()
      .matches(/^\d{8,15}$/, 'Phone number must be 8-15 digits')
      .required('Phone number is required'),
  }),
  
  jobTitle: Yup.string()
    .max(100, 'Job title must not exceed 100 characters'),
  
  userLanguage: Yup.string()
    .oneOf(['en', 'ar'], 'Invalid language selection')
    .required('Language is required'),
  
  avatar: Yup.mixed()
    .test('fileSize', 'File size must be less than 5MB', (value) => {
      if (!value) return true;
      if (value instanceof File) {
        return value.size <= 5 * 1024 * 1024; // 5MB
      }
      return true;
    })
    .test('fileType', 'Only JPG, PNG, and WebP formats are allowed', (value) => {
      if (!value) return true;
      if (value instanceof File) {
        return ['image/jpeg', 'image/png', 'image/webp'].includes(value.type);
      }
      return true;
    }),
});