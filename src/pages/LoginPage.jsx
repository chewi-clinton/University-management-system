import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [role, setRole] = useState('Student'); // Default role is Student
  const navigate = useNavigate();

  const handleLogin = () => {
    if (role === 'Student') {
      navigate('/student-dashboard');
    } else if (role === 'Finance Officer') {
      navigate('/finance-dashboard');
    }
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden">
      {/* Top App Bar */}
      <div className="flex items-center bg-surface-light dark:bg-surface-dark p-4 pb-2 justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer text-[#111418] dark:text-white">
          <span className="material-symbols-outlined">arrow_back</span>
        </div>
        <h2 className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">University Portal</h2>
        <div className="flex w-12 items-center justify-end">
          <p className="text-[#617589] dark:text-gray-400 text-base font-bold leading-normal tracking-[0.015em] shrink-0 cursor-pointer">Help</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full p-4">
        {/* Branding / Icon */}
        <div className="flex justify-center mb-6">
          <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-4xl">school</span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center mb-6">
          <h1 className="text-[#111418] dark:text-white tracking-tight text-[32px] font-bold leading-tight pb-2">Welcome Back</h1>
          <p className="text-[#617589] dark:text-gray-400 text-base font-normal leading-normal">
            Sign in to access your dashboard.
          </p>
        </div>

        {/* Segmented Buttons (Role Switcher) */}
        <div className="mb-8">
          <div className="flex h-12 w-full items-center justify-center rounded-xl bg-[#f0f2f4] dark:bg-surface-dark p-1">
            {/* Option 1: Student */}
            <label
              className={`group flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 transition-all ${
                role === 'Student' ? 'bg-primary text-white' : 'bg-white text-[#111418] dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              <span className="truncate text-sm font-bold leading-normal">Student</span>
              <input
                checked={role === 'Student'}
                onChange={() => setRole('Student')}
                className="invisible w-0"
                name="user_role"
                type="radio"
                value="Student"
              />
            </label>
            {/* Option 2: Finance Officer */}
            <label
              className={`group flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 transition-all ${
                role === 'Finance Officer' ? 'bg-primary text-white' : 'bg-white text-[#111418] dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              <span className="truncate text-sm font-bold leading-normal">Finance Officer</span>
              <input
                checked={role === 'Finance Officer'}
                onChange={() => setRole('Finance Officer')}
                className="invisible w-0"
                name="user_role"
                type="radio"
                value="Finance Officer"
              />
            </label>
          </div>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-5">
          {/* Input: Username/ID */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[#111418] dark:text-gray-200 text-sm font-medium leading-normal" htmlFor="username">University ID or Email</label>
            <div className="relative flex items-center rounded-xl bg-[#f0f2f4] dark:bg-surface-dark h-14 w-full focus-within:ring-2 focus-within:ring-primary focus-within:bg-white dark:focus-within:bg-gray-800 transition-all overflow-hidden">
              <div className="pl-4 text-[#617589] dark:text-gray-400 flex items-center justify-center">
                <span className="material-symbols-outlined">person</span>
              </div>
              <input className="w-full bg-transparent border-none text-[#111418] dark:text-white text-base font-normal placeholder:text-[#9aa6b2] focus:ring-0 px-3 h-full" id="username" placeholder="e.g. 2024001 or name@uni.edu" type="text" />
            </div>
          </div>

          {/* Input: Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[#111418] dark:text-gray-200 text-sm font-medium leading-normal" htmlFor="password">Password</label>
            </div>
            <div className="relative flex items-center rounded-xl bg-[#f0f2f4] dark:bg-surface-dark h-14 w-full focus-within:ring-2 focus-within:ring-primary focus-within:bg-white dark:focus-within:bg-gray-800 transition-all overflow-hidden">
              <div className="pl-4 text-[#617589] dark:text-gray-400 flex items-center justify-center">
                <span className="material-symbols-outlined">lock</span>
              </div>
              <input className="w-full bg-transparent border-none text-[#111418] dark:text-white text-base font-normal placeholder:text-[#9aa6b2] focus:ring-0 px-3 h-full" id="password" placeholder="••••••••" type="password" />
              <div className="pr-4 text-[#617589] dark:text-gray-400 flex items-center justify-center cursor-pointer hover:text-primary">
                <span className="material-symbols-outlined">visibility_off</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end -mt-2">
            <a className="text-primary text-sm font-medium leading-normal hover:underline" href="#">Forgot password?</a>
          </div>

          {/* Action Button */}
          <button
            onClick={handleLogin}
            className="flex w-full items-center justify-center rounded-xl bg-primary h-12 px-5 mt-2 hover:bg-blue-600 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20"
          >
            <span className="text-white text-base font-bold leading-normal flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">login</span>
              Secure Log In
            </span>
          </button>
        </div>

        {/* Footer Section */}
        <div className="mt-auto pt-10 text-center">
          <p className="text-[#617589] dark:text-gray-500 text-sm">
            Protected by reCAPTCHA and subject to the University <a className="underline hover:text-primary" href="#">Privacy Policy</a>.
          </p>
          <div className="h-5"></div>
        </div>
      </div>
    </div>
  );
}