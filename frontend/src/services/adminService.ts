import api from '@/lib/api';
import { User } from './authService';

export interface ActivityLog {
  _id: string;
  userId: {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
  };
  feature: string;
  action: string;
  metadata: any;
  ip?: string;
  userAgent?: string;
  createdAt: string;
}

export interface ActivityFilter {
  userId?: string;
  feature?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  skip?: number;
}

export const getRecruiters = async () => {
  const response = await api.get<{ success: boolean; data: User[] }>('/admin/users');
  return response.data;
};

export const createRecruiter = async (data: any) => {
  const response = await api.post<{ success: boolean; message: string; data: User }>('/admin/users', data);
  return response.data;
};

export const updateRecruiter = async (id: string, data: Partial<User>) => {
  const response = await api.patch<{ success: boolean; message: string; data: User }>(`/admin/users/${id}`, data);
  return response.data;
};

export const deleteRecruiter = async (id: string) => {
  const response = await api.delete<{ success: boolean; message: string }>(`/admin/users/${id}`);
  return response.data;
};

export const resetPassword = async (id: string, newPassword: string) => {
  const response = await api.patch<{ success: boolean; message: string }>(`/admin/users/${id}/reset-password`, { newPassword });
  return response.data;
};

export const getActivityLogs = async (filters: ActivityFilter = {}) => {
  const response = await api.get<{ success: boolean; data: ActivityLog[]; pagination: any }>('/admin/activity', { params: filters });
  return response.data;
};

export const deleteActivities = async (ids: string[]) => {
  const response = await api.delete<{ success: boolean; message: string }>('/admin/activity', { data: { ids } });
  return response.data;
};

export const purgeActivities = async () => {
  const response = await api.delete<{ success: boolean; message: string }>('/admin/activity/purge');
  return response.data;
};
