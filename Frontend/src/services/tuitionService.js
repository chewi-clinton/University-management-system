import { tuitionAPI } from './api';

export const getTuitionData = async (status = 'all') => {
  try {
    const data = await tuitionAPI.getAll(status);
    return data;
  } catch (error) {
    console.error('Error fetching tuition:', error);
    return [];
  }
};

export const getTuitionStats = async () => {
  try {
    return await tuitionAPI.getStats();
  } catch (error) {
    console.error('Error fetching stats:', error);
    return { pending: 0, overdue: 0, today: 0, overdueCount: 0 };
  }
};

export const updateTuitionPayment = async (id, status) => {
  try {
    return await tuitionAPI.updateStatus(id, status, new Date());
  } catch (error) {
    console.error('Error updating tuition:', error);
    throw error;
  }
};