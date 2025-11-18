"use client";

import { authApi } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { useAuthStore } from "@/store/useAuth";
import { Router } from "next/router";
import { useRouter } from "next/navigation";

const { setUser, currentUser } = useAuthStore.getState();

export const useUserLogin = () => {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: authApi.login,
    onSuccess: (res) => {
      setUser(res.data?.user);
      toast({
        title: "Login Successful 🎉",
        description: "You are now logged in.",
      });
      localStorage.setItem("ticketing-user", JSON.stringify(response.user));
      router.push("/");
    },
    onError: (error) => {
      toast({
        title: "Login Failed ❌",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Login failed. Please check your credentials.",
      });
    },
  });
};

export const useUserRegister = () => {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["register"],
    mutationFn: authApi.register,
    onSuccess: (res) => {
      setUser(res.data?.user);
      toast({
        title: "Registration Successful 🎊",
        description: "Welcome aboard! Your account has been created.",
      });
    },
    onError: (error) => {
      toast({
        title: "Registration Failed ❌",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong. Please try again.",
      });
    },
  });
};

export const useUserLogout = () => {
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: authApi.logout,
    onSuccess: () => {
      toast({
        title: "Logged Out 👋",
        description: "You’ve been logged out successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Logout Failed ⚠️",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Logout attempt failed. Please try again.",
      });
    },
  });
};

export const useUserMetadata = () => {
  return useQuery({
    queryKey: ["userMetadata"],
    queryFn: authApi.getMetadata,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUserRefreshToken = () => {
  return useMutation({
    mutationKey: ["refreshToken"],
    mutationFn: authApi.refreshToken,
    onError: () => {
      toast({
        title: "Session Expired ⏰",
        description: "Your session has expired. Please log in again.",
      });
    },
  });
};
