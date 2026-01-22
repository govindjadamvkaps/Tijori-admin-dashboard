// interfaces/user.interface.ts
export interface Phone {
  country_code: string;
  number: string;
}

export interface StorageQuota {
  totalGB: number;
  usedBytes: number;
  availableBytes: number;
  lastCalculated: string;
}

export interface UserRole {
  _id: string;
  name: string;
}

export interface UserProfile {
  _id: string;
  fullName: string;
  email: string;
  phone: Phone;
  avatar: string;
  role: UserRole;
  jobTitle: string;
  isActive: boolean;
  isVerified: boolean;
  isDeleted: boolean;
  userLanguage: string;
  authProvider: string;
  userType: string;
  storageQuota: StorageQuota;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  avatar?: File;
  phone?: Phone;
  jobTitle?: string;
  userLanguage?: string;
}

export interface UpdateProfileApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: UserProfile;
}