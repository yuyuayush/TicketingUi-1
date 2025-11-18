"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm, Controller, FieldValues, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { GenericDialog } from "@/components/common/GenericDialog";
import { ApiDropdown } from "@/components/ui/ApiDropdown";
import { useGetTheaters } from "@/hooks/useTheater";
import { Input, Switch, Button } from "@/components/ui";
import { ConcertDialogProps, IConcertFormData } from "@/lib/types";
import { Label } from "@/components/ui/label";



const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const concertSchema = z
    .object({
        title: z.string().min(3, "Title must be at least 3 characters."),
        artist: z.string().min(3, "Artist name must be at least 3 characters."),
        theaterId: z.string().min(1, "Theater location is required."),
        genre: z.string().min(1, "Genre is required."),

        startTime: z.string().min(1, "Start time is required."),
        endTime: z.string().min(1, "End time is required."),

        basePrice: z.preprocess(
            (v) => (v === "" ? 0 : Number(v)),
            z.number().min(0, "Base price must be 0 or greater.")
        ),

        totalTickets: z.preprocess(
            (v) => (v === "" ? 1 : Number(v)),
            z.number().int().min(1, "Total tickets must be at least 1.")
        ),

        description: z
            .string()
            .max(5000, "Description cannot exceed 5000 characters.")
            .optional()
            .or(z.literal("")),

        isPublished: z.boolean().default(false),

        // --- Image URL ---
        imageUrl: z
            .string()
            .url("Must be a valid URL.")
            .optional()
            .or(z.literal("")),

        image: z
            .any()
            .optional()
            .refine(
                (file) => {
                    if (!file) return true; // No file → OK
                    if (!(file instanceof File)) return false;
                    return file.size <= MAX_FILE_SIZE; // Fixed: should be <= not >=
                },
                { message: "Max file size is 5MB." }
            ),
    }).refine(
        (data) =>
            !data.startTime ||
            !data.endTime ||
            new Date(data.endTime) > new Date(data.startTime),
        {
            message: "End time must be after start time.",
            path: ["endTime"],
        }
    ).refine((data) => !(data.image && data.imageUrl), {
        message: "You cannot provide both an image file and an image URL.",
        path: ["imageUrl"],
    });

export type ConcertFormType = z.infer<typeof concertSchema>;



export function ConcertDialog({
    open,
    setOpen,
    formData: initialFormData,
    editConcert,
    handleSave,
    isPending,
}: ConcertDialogProps) {
    const { data: theaters = [], isLoading: isLoadingTheaters } = useGetTheaters();
    const availableGenres = ['Pop', 'Rock', 'Classical', 'Jazz', 'Electronic', 'Hip Hop', 'Other'];

    // Utility function to format Date object for datetime-local input
    const formatForDateTimeLocal = useCallback((dateString?: string): string => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "";

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hour = String(date.getHours()).padStart(2, '0');
            const minute = String(date.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day}T${hour}:${minute}`;

        } catch (e) {
            return "";
        }
    }, []);


    type ConcertFormType = z.infer<typeof concertSchema>;


    const {
        control,
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<ConcertFormType>({
        resolver: zodResolver(concertSchema),
        defaultValues: initialFormData || {}
    });

    const watchedImageFile = watch("image");
    const watchedImageUrl = watch("imageUrl");

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Image Preview Effect
    useEffect(() => {
        if (watchedImageFile instanceof File) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(watchedImageFile);
        } else if (watchedImageUrl) {
            setImagePreview(watchedImageUrl);
        } else {
            setImagePreview(null);
        }
    }, [watchedImageFile, watchedImageUrl]);

    // Submission handler
    const handleDialogSave = handleSubmit(async (data) => {
        console.log(data);
        handleSave(data);
    });

    const handleRemoveImage = () => {
        setValue("image", null, { shouldValidate: true });
        setValue("imageUrl", "", { shouldValidate: true });
    };


    return (
        <GenericDialog
            onSave={handleDialogSave}
            open={open}
            setOpen={setOpen}
            title={editConcert ? "Edit Concert" : "Schedule New Concert"}
            isPending={isPending}
            saveButtonText={editConcert ? "Update Concert" : "Create Concert"}
            className="max-w-5xl "
        >
            {/* Bind the form submission to RHF's handleSubmit */}
            <form onSubmit={handleDialogSave} className="w-full">
                {/* Scrollable Container */}
                <div className="px-2 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Left Column: Core Details */}
                        <div className="flex flex-col gap-4">
                            <TitleInput register={register} error={errors.title?.message} />
                            <ArtistInput register={register} error={errors.artist?.message} />

                            <TheaterDropdown
                                control={control}
                                theaters={theaters}
                                isLoading={isLoadingTheaters}
                                error={errors.theaterId?.message}
                            />

                            <GenreDropdown
                                control={control}
                                genres={availableGenres}
                                error={errors.genre?.message}
                            />

                            <DateTimeInputs
                                register={register}
                                errors={errors}
                            />

                            <TotalTicketsInput register={register} error={errors.totalTickets?.message} />
                        </div>

                        {/* Right Column: Financial, Image & Status */}
                        <div className="flex flex-col gap-4">
                            <BasePriceInput register={register} error={errors.basePrice?.message} />

                            <ImageUpload
                                register={register}
                                setValue={setValue as UseFormSetValue<IConcertFormData>} // Pass setValue
                                imageUrl={watchedImageUrl}
                                imagePreview={imagePreview}
                                // Display errors for both imageUrl (URL) and image (File)
                                error={errors.imageUrl?.message || errors.image?.message}
                                removeImage={handleRemoveImage}

                            />

                            <DescriptionInput register={register} error={errors.description?.message} />

                            <PublishedSwitch control={control} />
                        </div>
                    </div>
                    {/* Display form errors */}
                    {Object.keys(errors).length > 0 && (
                        <p className="text-red-500 text-sm mt-4">
                            Please correct the errors above before saving.
                        </p>
                    )}
                </div>
                {/* Hidden submit button to allow form submission via Enter key if needed */}
                <button type="submit" hidden />
            </form>
        </GenericDialog>
    );
}

// ========================================================
// 3. Subcomponents (RHF Refactored)
// ========================================================

interface RHFInputProps {
    label: string;
    name: keyof IConcertFormData;
    register: UseFormRegister<IConcertFormData>; // Strong typing for register
    error?: string;
    type?: string;
    min?: number;
}

export const RHFInput: React.FC<RHFInputProps> = ({
    label,
    name,
    register,
    error,
    type = "text",
    min
}) => {
    return (
        <div className="flex flex-col space-y-1">
            <Label htmlFor={name} className="text-sm font-medium">
                {label}
            </Label>

            <Input
                id={name}
                type={type}
                min={min}
                {...register(name, {
                    ...(type === "number" ? { valueAsNumber: true } : {})
                })}
                className={error ? "border-red-500" : ""}
                placeholder={label}
            />

            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
};

function TitleInput({ register, error }: { register: UseFormRegister<IConcertFormData>; error?: string }) {
    return <RHFInput register={register} error={error} label="Title" name="title" />;
}

function ArtistInput({ register, error }: { register: UseFormRegister<IConcertFormData>; error?: string }) {
    return <RHFInput register={register} error={error} label="Artist / Band" name="artist" />;
}

function BasePriceInput({ register, error }: { register: UseFormRegister<IConcertFormData>; error?: string }) {
    return <RHFInput register={register} error={error} label="Base Price ($)" name="basePrice" type="number" min={0} />;
}

function TotalTicketsInput({ register, error }: { register: UseFormRegister<IConcertFormData>; error?: string }) {
    return <RHFInput register={register} error={error} label="Total Tickets" name="totalTickets" type="number" min={1} />;
}

function DescriptionInput({ register, error }: { register: UseFormRegister<IConcertFormData>; error?: string }) {
    return (
        <div className="flex flex-col ">
            <Label className="text-sm font-medium" htmlFor="description">Description</Label>
            <textarea
                {...register("description")}
                placeholder="Concert Description (max 5000 chars)"
                rows={3}
                id="description"
                className={`w-full p-2 border rounded-md resize-none text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${error ? "border-red-500" : ""}`}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}

function TheaterDropdown({ control, theaters, isLoading, error }: { control: any; theaters: any[]; isLoading: boolean; error?: string }) {
    return (
        <Controller
            name="theaterId"
            control={control}
            render={({ field }) => (
                <div className="flex flex-col space-y-1">
                    <Label className="text-sm font-medium">Theater Location</Label>
                    <ApiDropdown
                        placeholder="Select Venue"
                        value={field.value || ""}
                        onChange={field.onChange}
                        data={theaters}
                        isLoading={isLoading}
                        getLabel={(theater: any) => `${theater.name} ${theater.city ? `(${theater.city.name})` : ''}`}
                        getValue={(theater: any) => theater._id}
                        className={error ? "border-red-500" : ""}
                    />
                    {error && <p className="text-xs text-red-500">{error}</p>}
                </div>
            )}
        />
    );
}

function GenreDropdown({ control, genres, error }: { control: any; genres: string[]; error?: string }) {
    return (
        <Controller
            name="genre"
            control={control}
            render={({ field }) => (
                <div className="flex flex-col space-y-1">
                    <Label className="text-sm font-medium">Genre</Label>
                    <ApiDropdown
                        placeholder="Select Genre"
                        value={field.value || ""}
                        onChange={field.onChange}
                        data={genres.map((g) => ({ name: g, _id: g }))}
                        isLoading={false}
                        getLabel={(item: any) => item.name}
                        getValue={(item: any) => item._id}
                        className={error ? "border-red-500" : ""}
                    />
                    {error && <p className="text-xs text-red-500">{error}</p>}
                </div>
            )}
        />
    );
}

function DateTimeInputs({ register, errors }: { register: UseFormRegister<IConcertFormData>; errors: FieldValues }) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
                <Label className="text-sm font-medium" htmlFor="startTime">Start Time</Label>
                <Input
                    type="datetime-local"
                    {...register("startTime")}
                    id="startTime"
                    className={errors.startTime ? "border-red-500" : ""}
                />
                {errors.startTime && <p className="text-xs text-red-500">{errors.startTime.message as string}</p>}
            </div>
            <div className="flex flex-col space-y-1">
                <Label className="text-sm font-medium" htmlFor="endTime">End Time</Label>
                <Input
                    type="datetime-local"
                    {...register("endTime")}
                    id="endTime"
                    className={errors.endTime ? "border-red-500" : ""}
                />
                {errors.endTime && <p className="text-xs text-red-500">{errors.endTime.message as string}</p>}
            </div>
        </div>
    );
}

function ImageUpload({
    register,
    setValue, // Passed from parent
    imageUrl,
    imagePreview,
    error,
    removeImage,
}: {
    register: UseFormRegister<IConcertFormData>;
    setValue: UseFormSetValue<IConcertFormData>; // New prop type
    imageUrl?: string | null;
    imagePreview: string | null;
    error?: string;
    removeImage: () => void;
}) {

    // Handler for file input change
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        // 1. Clear URL, set file
        setValue("imageUrl", "", { shouldValidate: true });
        setValue("image", file, { shouldValidate: true });
        // The image input is registered, but we control the value via setValue for cross-field clearing
    };

    // Handler for URL input change
    const handleUrlUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // 1. Clear file, set URL
        setValue("image", null, { shouldValidate: true });
        setValue("imageUrl", value, { shouldValidate: true });
    };

    return (
        <div className="flex flex-col space-y-2 border p-3 rounded-md">
            <Label className="text-sm font-medium">Concert Image (Optional)</Label>
            <p className="text-xs text-gray-500">Upload a file (Max 5MB) OR paste a URL. Selecting a file clears the URL.</p>

            {/* 1️⃣ File Upload */}
            <input
                type="file"
                accept="image/*"
                {...register("image")}
                onChange={handleFileUpload}
                className={`border p-2 rounded ${error ? "border-red-500" : ""}`}
            />

            {/* 2️⃣ URL Input */}
            <Input
                type="text"
                placeholder="Enter image URL..."
                {...register("imageUrl")}
                value={imageUrl || ""}
                onChange={handleUrlUpdate}
                className={`border p-2 rounded ${error ? "border-red-500" : ""}`}
            />

            {/* Preview Section */}
            {imagePreview && (
                <div className="flex flex-col mt-3">
                    <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-40 w-full rounded-md object-cover border"
                    />

                    <Button
                        type="button"
                        onClick={removeImage}
                        variant="destructive"
                        className="mt-2 text-sm self-start"
                    >
                        Remove Image
                    </Button>
                </div>
            )}
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}

function PublishedSwitch({ control }: { control: any }) {
    return (
        <Controller
            name="isPublished"
            control={control}
            render={({ field }) => (
                <div className="mt-10 flex items-center justify-between pt-2">
                    <Label className="text-sm font-medium">Published (Visible to users)</Label>
                    <Switch
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                    />
                </div>
            )}
        />
    );
}