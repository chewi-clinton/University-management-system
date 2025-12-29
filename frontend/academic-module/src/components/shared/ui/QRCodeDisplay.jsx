import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Timer, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import Button from "./Button";
import "../../../styles/components/QRCodeDisplay.css";

const QRCodeDisplay = ({ qrData, expiresIn = 300, onRegenerate }) => {
  const [timeLeft, setTimeLeft] = useState(expiresIn);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    setTimeLeft(expiresIn);
    setIsExpired(false);
  }, [expiresIn]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const progress = (timeLeft / expiresIn) * 100;
  const circumference = 2 * Math.PI * 150;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const handleRegenerate = () => {
    setTimeLeft(expiresIn);
    setIsExpired(false);
    onRegenerate?.();
  };

  return (
    <div className="qr-display">
      <div className="qr-display__container">
        <div className="qr-display__code">
          <div className="qr-display__progress-ring">
            <svg width="320" height="320" className="qr-display__progress">
              <circle
                cx="160"
                cy="160"
                r="150"
                fill="none"
                stroke="var(--border-color)"
                strokeWidth="8"
              />
              <circle
                cx="160"
                cy="160"
                r="150"
                fill="none"
                stroke={isExpired ? "var(--error-500)" : "var(--primary-500)"}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 160 160)"
                style={{
                  transition: "stroke-dashoffset 1s ease-in-out",
                }}
              />
            </svg>
            <div className="qr-display__code-inner">
              <QRCodeSVG
                value={qrData}
                size={280}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>
        </div>

        <div className="qr-display__timer">
          <Timer size={20} />
          <span>
            {isExpired
              ? "QR Code Expired"
              : `Valid for: ${formatTime(timeLeft)} remaining`}
          </span>
        </div>

        <div className="qr-display__actions">
          <Button
            onClick={handleRegenerate}
            variant="secondary"
            icon={<RefreshCw size={16} />}
            disabled={!isExpired && timeLeft > 30}
          >
            Regenerate QR
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
