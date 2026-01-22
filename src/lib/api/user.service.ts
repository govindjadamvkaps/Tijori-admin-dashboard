// lib/api/user.service.ts
import { apiRequest } from '../axiosInstance';
import { UpdateProfileApiResponse, UpdateProfilePayload } from '@/interfaces/user.interface';

export const userService = {
  updateProfile: async (
    userId: string,
    data: UpdateProfilePayload
  ): Promise<UpdateProfileApiResponse> => {
    const formData = new FormData();
    
    if (data.fullName) {
      formData.append('fullName', data.fullName);
    }
    
    if (data.avatar) {
      formData.append('avatar', data.avatar);
    }
    
    if (data.phone) {
      formData.append('phone[country_code]', data.phone.country_code);
      formData.append('phone[number]', data.phone.number);
    }
    
    if (data.jobTitle) {
      formData.append('jobTitle', data.jobTitle);
    }
    
    if (data.userLanguage) {
      formData.append('userLanguage', data.userLanguage);
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/update-profile/${userId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${document.cookie
            .split('; ')
            .find((row) => row.startsWith('access_token='))
            ?.split('=')[1]}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }

    return response.json();
  },
};