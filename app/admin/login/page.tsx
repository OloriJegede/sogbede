"use client";

import React, { useState } from "react";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F3] flex items-center justify-center p-4">
      <Card className="w-full max-w-[480px]">
        <CardHeader className="space-y-4 text-center pb-8">
          <div>
            <h1 className="text-[32px] skranji font-bold text-[#3A2B27] mb-2">
              SoGbédè
            </h1>
            <p className="text-[14px] text-[#615552]">Admin Dashboard</p>
          </div>
          <CardTitle className="text-[24px] text-[#1C1A1A] montserrat-semibold">
            Welcome Back
          </CardTitle>
          <p className="text-[14px] text-[#615552]">
            Sign in to access your admin dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <Label className="text-[#777676] text-[12px] mb-1">
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#777676] w-4 h-4" />
                  <Input
                    type="email"
                    placeholder="admin@sogbede.com"
                    className="pl-10 bg-[#FAF9F8] border-[#ECE8E4] h-[48px]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <Label className="text-[#777676] text-[12px] mb-1">
                  Password *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#777676] w-4 h-4" />
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10 bg-[#FAF9F8] border-[#ECE8E4] h-[48px]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-[14px] text-[#615552] cursor-pointer"
                >
                  Remember me
                </label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3A2B27] text-white h-[48px] hover:bg-[#2A1B17]"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
