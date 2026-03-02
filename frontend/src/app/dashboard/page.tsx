"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useLogout } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function DashboardSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );
}

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !user) return <DashboardSkeleton />;

  const initials = user.displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <span className="font-bold text-white text-sm">Secure Auth</span>
          </div>

          <Button
            onClick={() => logout()}
            disabled={isLoggingOut}
            variant="outline"
            size="sm"
            className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            {isLoggingOut ? (
              <>
                <span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin mr-2" />
                Signing out...
              </>
            ) : (
              "Sign out"
            )}
          </Button>
        </div>
      </nav>

      {/* Main content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Welcome back, manage your account below.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Card */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle className="text-white text-base">
                Your Profile
              </CardTitle>
              <CardDescription className="text-slate-400 text-sm">
                Information from your Google account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar + Name */}
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 ring-2 ring-indigo-500/50 ring-offset-2 ring-offset-slate-950">
                  <AvatarImage src={user.avatar} alt={user.displayName} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-lg font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white font-semibold text-lg leading-tight">
                    {user.displayName}
                  </p>
                  <p className="text-slate-400 text-sm">{user.email}</p>
                </div>
              </div>

              <Separator className="bg-white/10" />

              {/* Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Account ID</span>
                  <span className="text-slate-300 text-xs font-mono bg-white/5 px-2 py-1 rounded-md">
                    {user._id.slice(-8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Member since</span>
                  <span className="text-slate-300 text-sm">{joinedDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Auth provider</span>
                  <Badge
                    variant="outline"
                    className="border-blue-500/40 text-blue-400 bg-blue-500/10 text-xs"
                  >
                    Google
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Card */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle className="text-white text-base">Security</CardTitle>
              <CardDescription className="text-slate-400 text-sm">
                Your account security status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  label: "Google OAuth 2.0",
                  desc: "Your identity is verified by Google",
                  status: "Active",
                  color: "emerald",
                },
                {
                  label: "JWT Session",
                  desc: "Secure HTTP-only cookie token",
                  status: "7 days",
                  color: "indigo",
                },
                {
                  label: "Email verified",
                  desc: "Verified through your Google account",
                  status: "Verified",
                  color: "emerald",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
                >
                  <div
                    className={`w-2 h-2 mt-1.5 rounded-full bg-${item.color}-400 flex-shrink-0 animate-pulse`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">
                      {item.label}
                    </p>
                    <p className="text-slate-500 text-xs">{item.desc}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`border-${item.color}-500/40 text-${item.color}-400 bg-${item.color}-500/10 text-xs flex-shrink-0`}
                  >
                    {item.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
