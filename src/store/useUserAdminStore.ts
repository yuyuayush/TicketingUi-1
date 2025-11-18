"use client";

import { create } from "zustand";
import { IUser, IUserFormData, UserStoreState } from "@/lib/types";

export const useUserStore = create<UserStoreState>((set, get) => ({
    editUser: null,
    isDialogOpen: false,
    formData: {
        name: "",
        email: "",
        phone: "",
        role: "USER",
        isActive: true,
        newPassword: "",
    },

    openDialog: (user?: IUser) => {
        if (user) {
            set({
                editUser: user,
                formData: {
                    id: user._id,
                    name: user.name || "",
                    email: user.email || "",
                    phone: user.phone || "",
                    role: user.role || "USER",
                    isActive: user.isActive ?? true,
                    newPassword: "",
                },
                isDialogOpen: true,
            });
        } else {
            get().resetFormData();
            set({ editUser: null, isDialogOpen: true });
        }
    },

    closeDialog: () => set({ isDialogOpen: false, editUser: null }),

    setFormData: (data: IUserFormData) => set({ formData: data }),

    resetFormData: () =>
        set({
            formData: {
                name: "",
                email: "",
                phone: "",
                role: "USER",
                isActive: true,
                newPassword: "",
            },
        }),
}));
