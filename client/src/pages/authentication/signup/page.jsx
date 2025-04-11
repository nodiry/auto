import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { siteConfig } from "../../../config/site";
import React from "react";

const SignUp = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "", email: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setError("");
      setLoading(true);

      const response = await fetch(siteConfig.links.signup, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");

      navigate("/auth/signin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md bg-white  rounded-2xl shadow-xl p-8 space-y-6 border border-zinc-200 dark:border-zinc-700">
        <div className="text-center">
          <img src="/favicon.png" alt="Dream Auto Logo" className="mx-auto mb-4" width={72} height={72} />
          <h1 className="text-2xl font-semibold">Create an Account</h1>
          <p className="text-muted-foreground text-sm">Buy your dream car!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-sm text-red-500 text-center">{error}</div>}

          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full px-4 py-2 border rounded-lg bg-transparent"
            value={formData.username}
            onChange={handleInputChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg bg-transparent"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <div className="relative">
            <input
              type={isVisible ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg bg-transparent pr-10"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={toggleVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              disabled={loading}
              aria-label="Toggle password visibility"
            >
              {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="bg-blue-600 w-full text-white rounded-lg py-2 hover:opacity-90 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/auth/login")}
            className="text-blue-500 hover:underline"
            disabled={loading}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
