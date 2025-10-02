import * as Label from "@radix-ui/react-label";
import { useState, useEffect, useRef } from "react";
import { verifyOtp, resendOtp } from "../api/user.api";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useNavigate } from "@tanstack/react-router";
import { login } from "../store/slices/authSlice";
import { formatTime } from "../utils/common";

function OtpForm({ toggleForm, email }) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); 
  const [resendTimeLeft, setResendTimeLeft] = useState(0); 
  const [otpSentTime, setOtpSentTime] = useState(Date.now()); 
  const [hasResentOnce, setHasResentOnce] = useState(false); 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const timerRef = useRef(null);
  const resendTimerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - otpSentTime) / 1000);
      const remaining = 300 - elapsed; 
      
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        clearInterval(timerRef.current);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [otpSentTime]);

  useEffect(() => {
    if (resendTimeLeft > 0) {
      resendTimerRef.current = setTimeout(() => {
        setResendTimeLeft(resendTimeLeft - 1);
      }, 1000);
    }

    return () => {
      if (resendTimerRef.current) clearTimeout(resendTimerRef.current);
    };
  }, [resendTimeLeft]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      toast.error("OTP is required");
      return;
    }
    
    if (otp.length !== 6) {
      toast.error("OTP must be 6 characters");
      return;
    }
    
    if (timeLeft <= 0) {
      toast.error("OTP has expired. Please request a new one.");
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await verifyOtp(email, otp);
      dispatch(login(data.user));
      toast.success("Email verified successfully!");
      navigate({ to: "/dashboard" });
    } catch (err) {
      console.error("OTP verification error:", err);
      toast.error(err?.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      await resendOtp(email);
      toast.success("OTP has been resent to your email");
      
      setOtpSentTime(Date.now());
      setTimeLeft(300);
      
      if (!hasResentOnce) {
        setHasResentOnce(true);
        setResendTimeLeft(60); 
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      toast.error(err?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z0-9]*$/.test(value) && value.length <= 6) {
      setOtp(value.toUpperCase());
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl px-6 py-6 w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">Verify Your Email</h2>
      <p className="text-center text-gray-600 mb-2">
        We've sent a 6-character verification code to {email}
      </p>
      
      {/* OTP expiry timer */}
      <div className="text-center mb-4">
        {timeLeft > 0 ? (
          <p className="text-sm text-gray-500">
            Code expires in <span className="font-semibold text-red-500">{formatTime(timeLeft)}</span>
          </p>
        ) : (
          <p className="text-sm text-red-500 font-semibold">Code has expired</p>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label.Root htmlFor="otp" className="font-semibold">
            Verification Code
          </Label.Root>
          <input
            id="otp"
            type="text"
            placeholder="ABC123"
            maxLength={6}
            pattern="[a-zA-Z0-9]{6}"
            required
            className="w-full px-4 py-3 mt-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-center text-xl tracking-widest uppercase"
            onChange={handleOtpChange}
            value={otp}
            disabled={isLoading || timeLeft <= 0}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || timeLeft <= 0}
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Verifying..." : "Verify"}
        </button>
      </form>
      <div className="flex justify-between mt-4 text-sm">
        <button 
          onClick={() => toggleForm('register')} 
          className="text-blue-600 hover:underline cursor-pointer"
          disabled={isLoading}
        >
          Back to Register
        </button>
        <button 
          onClick={handleResendOtp} 
          className="text-blue-600 hover:underline cursor-pointer disabled:text-gray-400"
          disabled={isLoading || isResending || resendTimeLeft > 0}
        >
          {isResending 
            ? "Resending..." 
            : resendTimeLeft > 0 
              ? `Resend in ${formatTime(resendTimeLeft)}` 
              : "Resend OTP"
          }
        </button>
      </div>
    </div>
  );
}

export default OtpForm;
