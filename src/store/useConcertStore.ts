"use client";

import { create } from "zustand";

import { ConcertAdminStoreState, IConcertDisplay, IConcertFormData } from "@/lib/types";
import { toLocalDatetimeString } from "@/lib/utils";

const initialFormData: IConcertFormData = {
    title: "",
    artist: "",
    genre: "Pop", // Default genre
    startTime: "",
    endTime: "",
    theaterId: "",
    basePrice: 0,
    totalTickets: 0,
    description: "",
    image: null,
    isPublished: false,
    imageUrl: "",
};

export const useConcertAdminStore = create<ConcertAdminStoreState>((set, get) => ({
    editConcert: null,
    viewConcert: null,
    isEditOpen: false,
    isViewOpen: false,
    formData: initialFormData,

    setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),

    resetFormData: () => set({ formData: initialFormData }),

    openEditDialog: (concert?: IConcertDisplay) => {
        if (concert) {
            const initialDataFromConcert: IConcertFormData = {
                id: concert._id,
                title: concert.title || "",
                artist: concert.artist || "",
                genre: concert.genre || "Pop",
                // Convert ISO string to local datetime format for input fields
                startTime: toLocalDatetimeString(concert.startTime),
                endTime: toLocalDatetimeString(concert.endTime),
                // Handle both populated object and string ID
                theaterId: typeof concert.theaterId === 'object' ? concert.theaterId._id : concert.theaterId || "",
                basePrice: concert.basePrice || 0,
                totalTickets: (concert as any).totalTickets ?? 0,
                description: concert.description || "",
                isPublished: concert.isPublished ?? false,
                // Use Cloudinary image URL if available, otherwise fallback to imageUrl
                imageUrl: (concert as any).images?.[0]?.url || (concert as any).imageUrl || "",
                image: null, // Always reset the File input when opening the dialog
            };

            set({
                editConcert: concert,
                formData: initialDataFromConcert,
                isEditOpen: true,
            });
        } else {
            // New Concert (reset form data)
            get().resetFormData();
            set({ editConcert: null, isEditOpen: true });
        }
    },

    closeEditDialog: () => set({ isEditOpen: false, editConcert: null }),

    openViewDialog: (concert: IConcertDisplay) => set({ viewConcert: concert, isViewOpen: true }),

    closeViewDialog: () => set({ isViewOpen: false, viewConcert: null }),
}));