import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";

export default function VerifyEmailPage() {
  const { uid, token } = useParams();
  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.get(`verify-email/${uid}/${token}/`);
        setStatus("success");
        setMessage(res.data.message);
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.error || "Verification failed.");
      }
    };
    verify();
  }, [uid, token]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center shadow-2xl">
        {status === "verifying" && <p className="text-black">Verifying your email...</p>}

        {status === "success" && (
          <>
            <h1 className="text-2xl font-bold mb-2 text-black">Email Verified 🎉</h1>
            <p className="text-muted-foreground mb-6">{message}</p>
            <Link to="/login" className="text-accent font-semibold">Go to Login</Link>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold mb-2 text-black">Verification Failed</h1>
            <p className="text-muted-foreground">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}