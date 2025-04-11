import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { siteConfig } from "../../../config/site";
import { Loader2 } from "lucide-react";
import React from "react";

const TwoAuth = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Authentication token is missing. Please log in again.");
      return;
    }
    if (code.length !== 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await fetch(siteConfig.links.twoauth, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, passcode: code }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.removeItem("email");
      navigate("/dashboard");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-muted">
      <div className="flex flex-col w-full max-w-md p-6 mx-auto bg-white rounded-xl shadow-lg border animate-in fade-in slide-in-from-bottom-4">
        <img
          src="/favicon.png"
          className="mx-auto"
          alt="Logo"
          width={70}
          height={70}
        />
        <h1 className="text-center text-2xl font-bold mt-4">
          Two-Factor Authentication
        </h1>
        <p className="text-center text-muted-foreground text-sm mt-2 mb-6">
          We’ve sent a 6-digit verification code to{" "}
          <span className="font-semibold">{email}</span>. Please enter it below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 text-center font-medium">
              {error}
            </div>
          )}

          <input
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full text-center text-xl tracking-widest border rounded-md p-2 focus:outline-none focus:ring focus:ring-primary"
            placeholder="_ _ _ _ _ _"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-primary/90 transition flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" /> Verifying...
              </>
            ) : (
              "Verify Code"
            )}
          </button>

          <p className="text-center text-sm text-muted-foreground mt-2">
            Didn’t receive the code?{" "}
            <span className="text-blue-700 text-primary cursor-pointer hover:underline">
              Resend
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default TwoAuth;
