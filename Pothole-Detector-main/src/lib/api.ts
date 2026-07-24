import axios, { AxiosError } from 'axios';
import { Report, NewsAlert } from '../types';
import { auth } from './firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5001/api';


export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const api = {
  /**
   * Fetch all pothole reports from the backend database.
   */
  getReports: async (): Promise<Report[]> => {
    const response = await apiClient.get<Report[]>('/reports');
    return response.data;
  },

  /**
   * Submit a new pothole report using multipart FormData (since it includes an image file).
   * Supports handling duplicate conflicts (HTTP 409) with a specialized error response structure.
   */
  createReport: async (formData: FormData): Promise<Report> => {
    try {
      const response = await apiClient.post<Report>('/reports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        // Re-throw duplicate reports data contained inside response
        throw error;
      }
      throw error;
    }
  },

  /**
   * Upvote a pothole report to increase its priority level.
   */
  upvoteReport: async (id: string): Promise<{ upvotes_count: number }> => {
    const response = await apiClient.post<{ upvotes_count: number }>(`/reports/${id}/upvote`);
    return response.data;
  },

  /**
   * Update the remediation status of a report (Admin only).
   */
  updateReportStatus: async (id: string, status: 'reported' | 'acknowledged' | 'in_progress' | 'resolved'): Promise<Report> => {
    const response = await apiClient.put<Report>(`/reports/${id}/status`, { status });
    return response.data;
  },

  /**
   * Fetch live/historic local news alerts and road safety updates.
   */
  getNews: async (): Promise<NewsAlert[]> => {
    const response = await apiClient.get<NewsAlert[]>('/news');
    return response.data;
  },

  /**
   * Trigger on-demand web scraping for latest Al Jazeera & road safety news.
   */
  syncNews: async (): Promise<NewsAlert[]> => {
    const response = await apiClient.post<{ message: string; data: NewsAlert[] }>('/news/sync');
    return response.data.data;
  },
};

