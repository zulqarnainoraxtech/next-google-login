"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export interface User {
  _id: string;
  googleId: string;
  displayName: string;
  email: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  success: boolean;
  user: User;
}

const fetchMe = async (): Promise<User> => {
  const { data } = await api.get<AuthResponse>("/api/auth/me");
  return data.user;
};

const logoutUser = async (): Promise<void> => {
  await api.post("/api/auth/logout");
};

export const useAuth = () => {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery<User, Error>({
    queryKey: ["auth", "me"],
    queryFn: fetchMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    error,
  };
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      router.push("/login");
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });
};
