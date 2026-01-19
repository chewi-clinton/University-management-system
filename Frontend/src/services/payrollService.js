import { payrollAPI } from './api';

export const getPayrollData = async (status = 'all') => {
  try {
    const data = await payrollAPI.getAll(status);
    return data;
  } catch (error) {
    console.error('Error fetching payroll:', error);
    return [];
  }
};

export const getPayrollStats = async () => {
  try {
    return await payrollAPI.getStats();
  } catch (error) {
    console.error('Error fetching payroll stats:', error);
    return { employees: 0, totalPayout: 0, deductions: 0, flaggedCount: 0 };
  }
};

export const updatePayrollStatus = async (id, status) => {
  try {
    return await payrollAPI.updateStatus(id, status, new Date());
  } catch (error) {
    console.error('Error updating payroll:', error);
    throw error;
  }
};