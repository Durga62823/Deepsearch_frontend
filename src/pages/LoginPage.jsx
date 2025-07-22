// src/pages/LoginPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GalleryVerticalEnd } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AuthContext } from "../context/AuthContext";
import { authAPI } from "../services/api";
import { Typewriter } from "react-simple-typewriter";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading, login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) navigate("/dashboard", { replace: true });
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authAPI.login(email, password);
      if (res.data?.token && res.data?.user) {
        login(res.data.token, res.data.user);
      } else {
        setError("Login successful but missing token or user data.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
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
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold  tracking-tight">Welcome to DeepSearch</h1>
              <p className="text-muted-foreground">Enter your credentials to access your account</p>
            </div>
            {error && <div className="bg-destructive/15 text-destructive p-4 rounded-md text-center">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="you@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} placeholder="••••••••" onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
              </div>
              <Button type="submit" className="w-full bg-red-400 hover:bg-black rounded-4xl hover:text-rose-50 cursor-pointer" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
            </form>
            <div className="text-center text-sm">
              Don't have an account?{' '}
              <Button variant="link" onClick={() => navigate("/signup")} className="p-0 text-primary font-medium cursor-pointer">Sign up</Button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 hidden lg:flex items-center justify-center p-10 text-center">
        <div className="max-w-md space-y-4">
          <div className="text-3xl font-semibold ">
            Smart <span className=" text-red-600">
              <Typewriter words={["Search", "Insights", "Tagging"]} loop cursor cursorStyle="|" typeSpeed={80} deleteSpeed={50} delaySpeed={1000} />
            </span> with AI
          </div>
          <p className="text-muted-foreground text-base">Log in to explore intelligent document understanding powered by NLP & ML.</p>
          <p className="text-sm text-gray-500">Built with MERN Stack · Entity Extraction · Semantic Match</p>
        </div>
      </div>
    </div>
  );
}