import { leaveAPI } from './api';

export const getLeaveBalance = async () => {
  try {
    const data = await leaveAPI.getBalance();
    return data;
  } catch (error) {
    console.error('Error fetching leave balance:', error);
    return null;
  }
};

export const getTeamLeaveRequests = async (status = 'pending') => {
  try {
    const data = await leaveAPI.getTeamRequests(status);
    return data;
  } catch (error) {
    console.error('Error fetching team requests:', error);
    return [];
  }
};

export const getMyLeaveRequests = async () => {
  try {
    const data = await leaveAPI.getMyRequests();
    return data;
  } catch (error) {
    console.error('Error fetching my requests:', error);
    return [];
  }
};

export const submitLeaveRequest = async (leaveData) => {
  try {
    const data = await leaveAPI.createRequest(leaveData);
    return data;
  } catch (error) {
    console.error('Error submitting leave request:', error);
    throw error;
  }
};

export const approveLeaveRequest = async (requestId, approvalReason) => {
  try {
    const data = await leaveAPI.approveRequest(requestId, approvalReason);
    return data;
  } catch (error) {
    console.error('Error approving request:', error);
    throw error;
  }
};

export const denyLeaveRequest = async (requestId, reason) => {
  try {
    const data = await leaveAPI.denyRequest(requestId, reason);
    return data;
  } catch (error) {
    console.error('Error denying request:', error);
    throw error;
  }
};

export const getPendingCount = async () => {
  try {
    const data = await leaveAPI.getPendingCount();
    return data.pendingCount;
  } catch (error) {
    console.error('Error fetching pending count:', error);
    return 0;
  }
};
