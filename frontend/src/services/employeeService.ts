import api from '@/lib/api';
import { User } from './authService';

export interface EmployeeResponse {
  success: boolean;
  message?: string;
  data: User | User[];
}

export const getEmployees = async (status?: string): Promise<User[]> => {
  const url = status ? `/employees?status=${status}` : '/employees';
  const response = await api.get<EmployeeResponse>(url);
  return response.data.data as User[];
};

export const updateEmployeeStatus = async (id: string, status: 'approved' | 'rejected' | 'pending'): Promise<User> => {
  const response = await api.put<EmployeeResponse>(`/employees/${id}/status`, { status });
  return response.data.data as User;
};

export const updateEmployee = async (id: string, data: Partial<User>): Promise<User> => {
  const response = await api.put<EmployeeResponse>(`/employees/${id}`, data);
  return response.data.data as User;
};

export const deleteEmployee = async (id: string): Promise<void> => {
  await api.delete(`/employees/${id}`);
};

export const resetEmployeePassword = async (id: string, password: string): Promise<void> => {
  await api.put(`/employees/${id}/reset-password`, { password });
};
