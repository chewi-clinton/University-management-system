import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import Card from "../components/shared/layout/Card";
import Button from "../components/shared/ui/Button";
import "../styles/pages/Unauthorized.css";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized">
      <motion.div
        className="unauthorized__card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ShieldAlert size={64} className="unauthorized__icon" />
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <div className="unauthorized__actions">
          <Button onClick={() => navigate(-1)} variant="secondary">
            Go Back
          </Button>
          <Button onClick={() => navigate("/")} variant="primary">
            Go to Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
