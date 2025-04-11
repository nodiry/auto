import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import * as Label from "@radix-ui/react-label";

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  const submitForget = async () => {
    if (!formData.email) return setError("Please enter your email");
    setError("");
    setLoading(true);

    try {
      const res = await fetch(siteConfig.links.forgot, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      if (data.go === "twoauth") {
        localStorage.setItem("email", formData.email);
        navigate("/auth/twoauth");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password)
      return setError("All fields are required");

    setError("");
    setLoading(true);

    try {
      const res = await fetch(siteConfig.links.signin, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      if (data.user === "twoauth") {
        localStorage.setItem("email", formData.email);
        navigate("/auth/twoauth");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.tasks) localStorage.setItem("todo", JSON.stringify(data.todo));
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-sm p-6 rounded-2xl bg-white border shadow-md space-y-6">
        <div className="text-center">
          <img src="/favicon.png" className="mx-auto mb-2" width={72} />
          <h1 className="text-2xl font-semibold text-gray-800">Dream Auto</h1>
          <p className="text-sm text-gray-500">Sign in to your account</p>
        </div>

        {error && (
          <div className="text-red-500 text-center text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label.Root htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </Label.Root>
            <input
              id="email"
              type="email"
              name="email"
              className="w-full px-4 py-2 border rounded-md bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1 relative">
            <Label.Root htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label.Root>
            <input
              id="password"
              type={isVisible ? "text" : "password"}
              name="password"
              className="w-full px-4 py-2 border rounded-md bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.password}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={toggleVisibility}
              className="absolute right-3 top-[36px] text-gray-500 hover:text-gray-800"
              disabled={loading}
            >
              {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex justify-between text-sm">
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={submitForget}
              disabled={loading}
            >
              {loading ? "Please wait..." : "Forgot password?"}
            </button>

            <button
              type="button"
              className="text-gray-600 hover:underline"
              onClick={() => navigate("/auth/signup")}
              disabled={loading}
            >
              Sign up instead
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
