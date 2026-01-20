import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { financeAPI } from '../services/financeService';

export default function MockPay() {
  const { txId } = useParams(); // route /mock-pay/:txId
  const [status, setStatus] = useState('Processing payment...');
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        const result = await financeAPI.simulatePayment(txId);
        setStatus('Payment successful');
        setTimeout(() => navigate('/student-dashboard'), 1200);
      } catch (err) {
        setStatus('Payment failed: ' + (err.message || ''));
      }
    };
    run();
  }, [txId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 bg-white rounded shadow">
        <h2 className="text-lg font-bold mb-4">Mock Payment</h2>
        <p>{status}</p>
      </div>
    </div>
  );
}