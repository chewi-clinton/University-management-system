import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "../../components/shared/ui/Input";
import Button from "../../components/shared/ui/Button";
import { useAuth } from "../../context/AuthContext.jsx";
import "../../styles/pages/Login.css";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const { login, isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = getRoleBasedRedirect(user.role);
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const getRoleBasedRedirect = (role) => {
    switch (role) {
      case "student":
        return "/student/dashboard";
      case "faculty":
        return "/faculty/dashboard";
      case "academic_admin":
        return "/admin/dashboard";
      case "super_admin":
        return "/admin/dashboard";
      default:
        return "/dashboard";
    }
  };

  const onSubmit = async (data) => {
    clearErrors("root");

    const {
      success,
      error: loginError,
      user: loggedInUser,
    } = await login(data);

    if (success) {
      // Navigation will be handled by the useEffect above
      // But we can also trigger it here for immediate redirect
      if (loggedInUser) {
        const redirectPath = getRoleBasedRedirect(loggedInUser.role);
        navigate(redirectPath, { replace: true });
      }
    } else {
      setError("root", {
        type: "manual",
        message: loginError || "Invalid email or password. Please try again.",
      });
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div className="login">
      <div className="login__container">
        <motion.div
          className={`login__card ${shake ? "shake" : ""}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="login__header">
            <div className="login__logo">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 className="login__title">University ERP System</h1>
            <p className="login__subtitle">Welcome Back</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="login__form">
            <div className="login__field">
              <label>Email</label>
              <Input
                type="email"
                placeholder="Enter your email"
                floatingLabel={false}
                disabled={isLoading}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email format",
                  },
                })}
                error={errors.email?.message}
              />
            </div>

            <div className="login__field">
              <label>Password</label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                floatingLabel={false}
                disabled={isLoading}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                error={errors.password?.message}
                actionIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="login__toggle-password"
                    disabled={isLoading}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                }
              />
            </div>

            <AnimatePresence>
              {errors.root && (
                <motion.div
                  className="login__error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <AlertCircle size={16} />
                  <span>{errors.root.message}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="login__options">
              <label className="login__remember">
                <input type="checkbox" disabled={isLoading} />
                <span>Remember Me</span>
              </label>
              <button
                type="button"
                className="login__forgot"
                disabled={isLoading}
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Login"}
            </Button>

            <div className="login__demo-creds">
              <p>
                <strong>Note:</strong>
              </p>
              <p>Use your university credentials to login</p>
              <p className="login__demo-hint">
                Contact admin if you don't have access
              </p>
            </div>
          </form>

          <div className="login__footer">
            <p>© 2024 University. All rights reserved.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
