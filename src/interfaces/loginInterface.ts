export interface Role {
  _id: string;
  name: "ADMIN" | "USER" | string;
  deleted_at: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Phone {
  country_code: string;
  number: string;
}


export interface StorageQuota {
  _id: string;
  totalGB: number;
  usedBytes: number;
  availableBytes: number;
  lastCalculated: string;
  id: string;
}


export interface User {
  _id: string;
  id: string;

  fullName: string;
  email: string;
  password: string;

  phone: Phone;
  avatar: string;
  role: Role;

  jobTitle: string;

  isActive: boolean;
  isVerified: boolean;
  isDeleted: boolean;

  userLanguage: "en" | "ar" | string;
  authProvider: "local" | "google" | "apple";
  userType: "admin" | "user" | string;

  deletedAt: string | null;

  storageQuota: StorageQuota;

  storageUsedGB: number;
  storageAvailableGB: number;
  storageUsagePercentage: number;

  createdAt: string;
  updatedAt: string;
  __v: number;
}


export interface LoginResponseDetails {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    user: User;
  };
}

