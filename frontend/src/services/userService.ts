import api from '@/lib/api';
import { User } from './authService';

export interface UpdateProfileData {
  firstname?: string;
  lastname?: string;
  companyname?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
  picture?: File;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: User;
}

export const getCurrentUser = async (): Promise<{ success: boolean; data: User }> => {
  const response = await api.get<{ success: boolean; data: User }>('/users/me');
  return response.data;
};

export const updateProfile = async (data: UpdateProfileData): Promise<UpdateProfileResponse> => {
  if (data.picture) {
    const formData = new FormData();
    if (data.firstname) formData.append('firstname', data.firstname);
    if (data.lastname) formData.append('lastname', data.lastname);
    if (data.companyname) formData.append('companyname', data.companyname);
    if (data.email) formData.append('email', data.email);
    if (data.password) formData.append('password', data.password);
    if (data.currentPassword) formData.append('currentPassword', data.currentPassword);
    formData.append('picture', data.picture);
    
    const response = await api.put<UpdateProfileResponse>('/users/me', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } else {
    const { picture, ...jsonData } = data;
    const response = await api.put<UpdateProfileResponse>('/users/me', jsonData);
    return response.data;
  }
};

