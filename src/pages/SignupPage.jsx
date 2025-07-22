// src/pages/SignupPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GalleryVerticalEnd } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AuthContext } from "../context/AuthContext";
import { authAPI } from "../services/api";
import { Typewriter } from "react-simple-typewriter";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);

  useEffect(() => {
    if (!authLoading && user) navigate("/dashboard", { replace: true });
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await authAPI.signup(name, email, password);
      setSuccess(res.data.message || "Registration successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col px-6 py-8 md:px-20">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-semibold text-2xl">
            <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="h-6 w-6" />
            </div>
            <span>
              Deep<span className="text-red-600">Search</span>
            </span>
          </a>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm space-y-6">
            {/* Header */}
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Create an account</h1>
              <p className="text-gray-500">
                Enter your information below to create your account
              </p>
            </div>

            {/* Error & Success */}
            {error && (
              <div className="bg-destructive/15 text-destructive p-4 rounded-md text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 text-green-700 p-4 rounded-md text-center">
                {success}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                className="w-full cursor-pointer bg-red-400 hover:bg-black hover:text-white"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create account"}
              </Button>

              <div className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Button
                  variant="link"
                  onClick={() => navigate("/login")}
                  className="text-primary font-medium p-0 cursor-pointer"
                >
                  Login
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Side - Info */}
      <div className="bg-gray-100 hidden lg:flex items-center justify-center p-10 text-center">
        <div className="max-w-md space-y-4">
          <h2 className="text-4xl font-bold text-gray-800">
            Your Knowledge Hub Starts Here
          </h2>
          <div className="text-2xl font-semibold">
            Smart{" "}
            <span className="text-3xl font-semibold text-red-600">
              <Typewriter
                words={["Upload", "Search", "Discovery"]}
                loop
                cursor
                cursorStyle="|"
                typeSpeed={80}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </span>{" "}
            with AI
          </div>
          <p className="text-muted-foreground text-base">
            Upload documents, explore key insights, and search smarter with
            DeepSearch's AI capabilities.
          </p>
          <p className="text-sm text-gray-500">
            Powered by MERN · Machine Learning · NLP Intelligence · Semantic Search
          </p>
        </div>
      </div>
    </div>
  );
}
