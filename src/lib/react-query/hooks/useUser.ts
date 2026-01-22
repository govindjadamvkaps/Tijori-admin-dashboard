// lib/react-query/hooks/useUser.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/lib/api/user.service';
import { UpdateProfilePayload } from '@/interfaces/user.interface';
import toast from 'react-hot-toast';
import { useAppDispatch } from '@/lib/hooks';
import { fetchUserProfile } from '@/lib/features/user/userSlice';

export const USER_QUERY_KEYS = {
  profile: ['user', 'profile'] as const,
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateProfilePayload }) =>
      userService.updateProfile(userId, data),
    onSuccess: async (response) => {
      toast.success(response.message || 'Profile updated successfully!');
      
      // Invalidate and refetch user profile
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.profile });
      
      // Update Redux state
      await dispatch(fetchUserProfile());
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
};