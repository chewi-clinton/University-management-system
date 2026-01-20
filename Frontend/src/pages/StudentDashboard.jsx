import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { getCurrentUser } from '../services/authService';
import { financeAPI } from '../services/financeService';
import { notificationsAPI } from '../services/notificationsService';
import { useNavigate } from 'react-router-dom';
import SupportChat from '../components/SupportChat';
import { marketingAPI } from '../services/marketingService';
import useNotifications from '../hooks/useNotifications';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { unread, notifications, refreshList, refreshUnread } = useNotifications();
  const [user, setUser] = useState(getCurrentUser());
  const [balanceInfo, setBalanceInfo] = useState({ totalDue: 0, tuitions: [] });
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [promo, setPromo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    // RBAC: only students allowed
    if (user.role !== 'student') {
      navigate('/');
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const b = await financeAPI.getBalance();
        setBalanceInfo(b);
        const n = await notificationsAPI.getNotifications();
        // setNotifications(n);
      } catch (err) {
        console.error(err);
      } finally { setLoading(false); }
    };
    load();

    const onUserChange = () => setUser(getCurrentUser());
    window.addEventListener('userChanged', onUserChange);
    window.addEventListener('storage', onUserChange);

    // poll notifications every 60s
    const poll = setInterval(async () => {
      try {
        const n = await notificationsAPI.getNotifications();
        // setNotifications(n);
      } catch {}
    }, 60000);

    return () => {
      window.removeEventListener('userChanged', onUserChange);
      window.removeEventListener('storage', onUserChange);
      clearInterval(poll);
    };
  }, [user, navigate]);

  const toggleVisible = () => setVisible(v => !v);

  const handlePayNow = async (tuition) => {
    if (!tuition) return;
    try {
      const tx = await financeAPI.createTransaction(tuition._id);
      // open payment provider page (simulated)
      window.open(tx.providerUrl, '_blank');
      // after payment provider notifies you would update transaction status via webhook; here we refresh
      setTimeout(async () => {
        const b = await financeAPI.getBalance();
        setBalanceInfo(b);
      }, 3000);
    } catch (err) {
      alert(err.message || 'Payment failed');
    }
  };

  const downloadInvoice = async (tuitionId) => {
    try {
      const res = await financeAPI.generateInvoice(tuitionId);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${tuitionId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message || 'Failed to download');
    }
  };

  // helper functions (add inside component, above return)
  const formatCurrency = (v) => `XAF ${Number(v || 0).toLocaleString(undefined, { minimumFractionDigits: 0 })}`;
  const formatDate = (d) => d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

  const nextPendingTuition = () => (balanceInfo.tuitions || []).find(t => t.status !== 'paid');

  const nextDueDate = () => {
    const t = nextPendingTuition();
    return t ? formatDate(t.dueDate) : formatDate(balanceInfo.tuitions?.[0]?.dueDate);
  };

  const daysUntil = (date) => {
    if (!date) return Infinity;
    const diff = new Date(date) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // fetch balance with optional studentId param (if student profile has an id)
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        const studentId = user.studentId || undefined;
        const b = await financeAPI.getBalance(studentId);
        setBalanceInfo(b);
        const n = await notificationsAPI.getNotifications();
        // setNotifications(n);

        // fetch recent transactions
        try {
          const tx = await financeAPI.getTransactionHistory(5);
          // expect { transactions: [...] } or an array — normalize
          setTransactions(Array.isArray(tx) ? tx : (tx.transactions || []));
        } catch (e) {
          setTransactions([]);
        }

        // marketing promo (existing)
        try {
          const p = await marketingAPI.getActivePromo();
          setPromo(p);
        } catch (e) { setPromo(null); }
      } catch (err) {
        console.error(err);
      } finally { setLoading(false); }
    };
    load();
  }, [user]);

  const openPromo = () => {
    if (!promo) return navigate('/bus-registration');
    const id = promo.promo_id || promo._id || promo.id || promo.code || 'promo';
    navigate(`/bus-registration?promo=${encodeURIComponent(id)}`);
  };

  // helper: return latest tuition (paid or pending) for invoice/download
  const latestTuition = () => {
    const arr = Array.isArray(balanceInfo.tuitions) ? [...balanceInfo.tuitions] : [];
    if (arr.length === 0) return null;
    arr.sort((a, b) => new Date(b.paidDate || b.createdAt || b.dueDate) - new Date(a.paidDate || a.createdAt || a.dueDate));
    return arr[0];
  };

  // helper: map category -> icon + color
  const txIcon = (type) => {
    switch ((type || '').toLowerCase()) {
      case 'tuition': return { icon: 'check_circle', color: 'bg-green-100 text-green-600' };
      case 'bookstore': return { icon: 'menu_book', color: 'bg-blue-100 text-blue-600' };
      case 'lab': case 'fees': return { icon: 'pending', color: 'bg-yellow-100 text-yellow-600' };
      case 'refund': return { icon: 'reply', color: 'bg-gray-100 text-gray-600' };
      default: return { icon: 'receipt_long', color: 'bg-gray-100 text-gray-600' };
    }
  };

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <Sidebar
        links={[
          { name: 'Dashboard', path: '/student-dashboard' },
          { name: 'Payment History', path: '/payment-history' },
          { name: 'Bus Registration', path: '/bus-registration' },
          { name: 'Notifications', path: '/notifications' },
        ]}
      />
      <div className="flex-1 bg-background-light dark:bg-background-dark font-display text-[#111418] dark:text-white overflow-x-hidden pb-24">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-4 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-white dark:ring-surface-dark"
                style={{
                  backgroundImage: user?.avatar
                    ? `url('${user.avatar}')`
                    : "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBgXt3kv-Sa_q9di6SguK38Y68ZxeHOedPgeCB0Ud8JzIC6e44S-OvGFHkCLRSPKh0blMMLI1R0Rre4vjaZT8K2CO04w2MzD-3obC6VRTcfdBSHX5eVWlBI-dDooktGUfrsQ-i0w-l80z8_kZmISuzKDN-h0Vf_s1hVPJwRo_7R_wgJJ_PzEiMFVCfPnhN8KgPlZi6Ggl97D1psHeMXkqzemfT5uEhL5YB0TEQg4uRsrJkejNYUx16_DM9jQDRLSIgS1COXShUWmc')",
                }}
              ></div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Good Morning,</span>
                <h2 className="text-lg font-bold leading-tight">{user?.name || 'Student'}</h2>
              </div>
            </div>
            <button
              className="relative flex size-10 items-center justify-center rounded-full bg-white dark:bg-surface-dark shadow-sm text-[#111418] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              onClick={async () => { await refreshList(10); setShowNotifications(v => !v); }}
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined">notifications</span>
              {unread > 0 && (
                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-white dark:border-background-dark text-[10px] px-1 text-white">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-4 mt-12 w-80 bg-white dark:bg-surface-dark rounded-md shadow-lg z-50 overflow-hidden">
                <div className="p-2 border-b text-sm font-semibold">Notifications</div>
                <div className="max-h-64 overflow-auto">
                  {notifications.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500">No notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n._id} className="p-3 border-b last:border-b-0">
                        <div className="text-sm font-medium text-[#111418] dark:text-white">{n.title || n.body}</div>
                        {n.body && <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{n.body}</div>}
                        <div className="text-[10px] text-gray-400 mt-2">{new Date(n.createdAt).toLocaleString()}</div>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex items-center justify-between p-2 border-t">
                  <button className="text-xs text-primary" onClick={async () => { await refreshList(10); }}>
                    Refresh
                  </button>
                  <button className="text-xs text-gray-500" onClick={() => { setShowNotifications(false); }}>
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 space-y-5">
          {/* Balance Card (Hero) - dynamic, visibility toggle, due-date color, pay button logic */}
          <div className="relative overflow-hidden rounded-xl" style={{ backgroundColor: Number(balanceInfo.totalDue || 0) > 0 ? '#0ea5a0' : '#10b981' }}>
            <div className="relative p-5 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <p className="text-white/80 text-sm font-medium">Outstanding Balance</p>
                  <div className="flex items-center gap-2">
                    <h1 className="text-white text-3xl font-bold tracking-tight" style={{ color: Number(balanceInfo.totalDue || 0) > 0 ? '#fff' : '#e6fffa' }}>
                      {visible ? formatCurrency(balanceInfo.totalDue) : 'XAF ****'}
                    </h1>
                    <button
                      className="text-white/70 hover:text-white transition-colors"
                      onClick={toggleVisible}
                      aria-label={visible ? 'Hide balance' : 'Show balance'}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {visible ? 'visibility' : 'visibility_off'}
                      </span>
                    </button>
                  </div>
                  <p className="text-white/90 text-sm font-medium mt-1 bg-white/10 w-fit px-2 py-0.5 rounded text-xs">
                    Due by{' '}
                    <span style={{ color: daysUntil(nextPendingTuition()?.dueDate || balanceInfo.tuitions?.[0]?.dueDate) <= 3 ? '#ffbaba' : 'inherit' }}>
                      {nextDueDate()}
                    </span>
                    { (balanceInfo.tuitions || []).some(t => t.status === 'overdue') && (
                      <span className="ml-2 text-yellow-200"> • You have overdue items</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="w-full h-px" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}></div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-white/80">
                  <span className="material-symbols-outlined text-[16px]">info</span>
                  <span className="text-xs">Late fees apply after due date</span>
                </div>
                <div>
                  {Number(balanceInfo.totalDue || 0) > 0 ? (
                    <button
                      onClick={() => handlePayNow(nextPendingTuition())}
                      className="flex items-center justify-center rounded-lg h-9 px-4 bg-white text-primary text-sm font-bold shadow-sm active:scale-95 transition-transform"
                    >
                      Pay Now
                    </button>
                  ) : (
                    <div className="text-sm text-white/90">No outstanding fees — your account is clear!</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div>
            <h3 className="text-base font-bold mb-3 text-[#111418] dark:text-white">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/payment-history')}
                className="flex flex-col gap-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark p-4 items-start shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-primary">
                  <span className="material-symbols-outlined">history</span>
                </div>
                <span className="text-sm font-bold leading-tight">Payment History</span>
              </button>

              <button
                onClick={() => navigate('/bus-registration')}
                className="flex flex-col gap-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark p-4 items-start shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                  <span className="material-symbols-outlined">directions_bus</span>
                </div>
                <span className="text-sm font-bold leading-tight">Bus Registration</span>
              </button>

              <button
                onClick={async () => {
                  const t = latestTuition();
                  if (!t) { alert('No invoices available'); return; }
                  await downloadInvoice(t._id);
                }}
                className="flex flex-col gap-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark p-4 items-start shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  <span className="material-symbols-outlined">description</span>
                </div>
                <span className="text-sm font-bold leading-tight">Download Invoice</span>
              </button>

              <button
                onClick={() => {
                  // open live chat widget if available, otherwise show built-in chat
                  if (window.openLiveChat) return window.openLiveChat();
                  setChatOpen(true);
                }}
                className="flex flex-col gap-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark p-4 items-start shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                  <span className="material-symbols-outlined">support_agent</span>
                </div>
                <span className="text-sm font-bold leading-tight">Support</span>
              </button>
            </div>
          </div>

          {/* Promo Card */}
          <button
            onClick={openPromo}
            className="rounded-xl overflow-hidden bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-gray-800 text-left flex w-full"
            aria-label={promo ? promo.title || 'Promotion' : 'Bus Registration Promo'}
          >
            <div className="flex-1 p-4 flex flex-col justify-center gap-2">
              <div className="flex items-center gap-2">
                <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {promo?.tag || 'Promo'}
                </span>
              </div>
              <p className="text-base font-bold leading-tight">{promo?.title || 'Semester Bus Pass'}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-normal leading-normal">
                {promo?.subtitle || 'Early Bird Discount ending soon. Save 15% on total fare.'}
              </p>
            </div>
            <div
              className="w-32 bg-cover bg-center"
              style={{
                backgroundImage: `url('${promo?.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAneQO73AmkmeLqP3AEcRghdHdvxRmPa1uBc8zKiVMOTXYOEDJFRKipvwYmpFa0kTdQaLKsr3ZI8XImDe9t9Pdz-AeVFoEKenWVFtoGJSU23-3TbFMbmAmWa8O4vItS2BM6WrEa8BxG2F_2tOGSAxgoDCq1mGTQT1hHecSlwsrtLxtCJj-Zm6uhV1ZJOBn5yoL4CJEnC9jGheUzDoPljpT2VtM4KFnPg5fqt-cDmbY46bjdx9w-z1cuWCILojsaQQeHycmft6EZOSs"}')`,
              }}
            ></div>
          </button>

          {/* Recent Transactions */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-base font-bold text-[#111418] dark:text-white">Recent Activity</h3>
              <a
                className="text-primary text-sm font-medium hover:underline"
                href="/payment_history.html"
                onClick={(e) => { e.preventDefault(); navigate('/payment-history'); }}
              >
                View All
              </a>
            </div>

            <div className="flex flex-col bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
              {transactions.length === 0 ? (
                <div className="p-4 text-sm text-gray-500">No recent activity</div>
              ) : (
                transactions.map((t) => {
                  const meta = txIcon(t.type || t.category);
                  const amountText = (t.amount || 0) < 0 ? `-XAF ${Math.abs(t.amount).toLocaleString()}` : `XAF ${Number(t.amount || 0).toLocaleString()}`;
                  return (
                    <div key={t._id || t.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className={`size-10 rounded-full ${meta.color} dark:bg-opacity-20 flex items-center justify-center shrink-0`}>
                          <span className="material-symbols-outlined">{meta.icon}</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#111418] dark:text-white">{t.title || t.description || (t.type || 'Transaction')}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(t.createdAt || t.date || Date.now()).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-[#111418] dark:text-white">{amountText}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 pb-safe pt-2 px-6 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:hidden">
          <div className="flex items-center justify-between h-14">
            <button className="flex flex-col items-center justify-center gap-1 text-primary w-16">
              <span className="material-symbols-outlined fill-1">home</span>
              <span className="text-[10px] font-bold">Home</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 w-16 transition-colors">
              <span className="material-symbols-outlined">school</span>
              <span className="text-[10px] font-medium">Academics</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 w-16 transition-colors">
              <span className="material-symbols-outlined">payments</span>
              <span className="text-[10px] font-medium">Finance</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 w-16 transition-colors">
              <span className="material-symbols-outlined">person</span>
              <span className="text-[10px] font-medium">Profile</span>
            </button>
          </div>
        </div>

        { /* add chat component near root of page */ }
        <SupportChat open={chatOpen} onClose={() => setChatOpen(false)} />
      </div>
    </div>
  );
};

export default StudentDashboard;