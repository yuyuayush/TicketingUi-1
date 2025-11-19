"use client";

import React, { useState, useEffect, useCallback } from "react";
import { GenericDialog } from "@/components/common/GenericDialog";
import { ApiDropdown } from "@/components/ui/ApiDropdown";
import { useGetTheaters } from "@/hooks/useTheater";
import { Input, Switch, Button } from "@/components/ui";
import { ConcertDialogProps } from "@/lib/types";
import { Label } from "@/components/ui/label";
import * as z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Zod schema for manual validation (optional)
const concertSchema = z.object({
    title: z.string().min(3),
    artist: z.string().min(3),
    theaterId: z.string().min(1),
    genre: z.string().min(1),
    startTime: z.string().min(1),
    endTime: z.string().min(1),
    basePrice: z.number().min(0),
    totalTickets: z.number().min(1),
    description: z.string().optional(),
    isPublished: z.boolean(),
    image: z.any().optional(),
});

export function ConcertDialog({
    open,
    setOpen,
    formData: initial,
    editConcert,
    handleSave,
    isPending,
}: ConcertDialogProps) {
    const { data: theaters = [], isLoading: isLoadingTheaters } = useGetTheaters();

    const genreList = [
        "Pop",
        "Rock",
        "Classical",
        "Jazz",
        "Electronic",
        "Hip Hop",
        "Other",
    ];

    const formatDT = useCallback((d?: string) => {
        if (!d) return "";
        const date = new Date(d);
        return [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0"),
        ].join("-") +
            "T" +
            [String(date.getHours()).padStart(2, "0"), String(date.getMinutes()).padStart(2, "0")].join(":");
    }, []);

    // --------------------
    // STATE (Controlled Fields)
    // --------------------
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [theaterId, setTheaterId] = useState("");
    const [genre, setGenre] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [basePrice, setBasePrice] = useState(0);
    const [totalTickets, setTotalTickets] = useState(1);
    const [description, setDescription] = useState("");
    const [isPublished, setIsPublished] = useState(false);

    const [image, setImage] = useState<File | string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // --------------------
    // LOAD EDIT DATA
    // --------------------
    useEffect(() => {
        if (!initial) return;

        setTitle(initial.title || "");
        setArtist(initial.artist || "");
        setTheaterId(initial.theaterId || "");
        setGenre(initial.genre || "");
        setStartTime(formatDT(initial.startTime));
        setEndTime(formatDT(initial.endTime));

        setBasePrice(initial.basePrice ?? 0);
        setTotalTickets(initial.totalTickets ?? 1);
        setDescription(initial.description || "");
        setIsPublished(initial.isPublished ?? false);

        if (typeof initial.image === "string") {
            setImage(initial.image);
            setImagePreview(initial.image);
        } else {
            setImage(null);
            setImagePreview(null);
        }
    }, [initial, formatDT]);

    // --------------------
    // IMAGE HANDLING
    // --------------------
    const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;

        if (file && file.size > MAX_FILE_SIZE) {
            alert("Image cannot exceed 5MB");
            return;
        }

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            // setImage(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    // --------------------
    // SAVE HANDLER
    // --------------------
    const save = () => {
        const payload = {
            title,
            artist,
            theaterId,
            genre,
            startTime,
            endTime,
            basePrice,
            totalTickets,
            description,
            isPublished,
            image:imagePreview,
        };

        handleSave(payload);
    };

    // --------------------
    // UI
    // --------------------
    return (
        <GenericDialog
            open={open}
            setOpen={setOpen}
            title={editConcert ? "Edit Concert" : "Schedule New Concert"}
            onSave={save}
            isPending={isPending}
            saveButtonText={editConcert ? "Update Concert" : "Create Concert"}
            className="max-w-5xl"
        >
            <div className="px-2 max-h-[70vh] overflow-y-auto">

                {/* GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* LEFT */}
                    <div className="flex flex-col gap-4">

                        {/* TITLE */}
                        <div>
                            <Label>Title</Label>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>

                        {/* ARTIST */}
                        <div>
                            <Label>Artist / Band</Label>
                            <Input value={artist} onChange={(e) => setArtist(e.target.value)} />
                        </div>

                        {/* THEATER */}
                        <div>
                            <Label>Theater</Label>
                            <ApiDropdown
                                data={theaters}
                                isLoading={isLoadingTheaters}
                                value={theaterId}
                                onChange={setTheaterId}
                                getLabel={(t) => `${t.name} (${t.city?.name || ""})`}
                                getValue={(t) => t._id}
                            />
                        </div>

                        {/* GENRE */}
                        <div>
                            <Label>Genre</Label>
                            <ApiDropdown
                                data={genreList.map((g) => ({ name: g, _id: g }))}
                                value={genre}
                                onChange={setGenre}
                                getLabel={(i) => i.name}
                                getValue={(i) => i._id}
                            />
                        </div>

                        {/* DATES */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Start Time</Label>
                                <Input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                            </div>
                            <div>
                                <Label>End Time</Label>
                                <Input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                            </div>
                        </div>

                        {/* TICKETS */}
                        <div>
                            <Label>Total Tickets</Label>
                            <Input
                                type="number"
                                min={1}
                                value={totalTickets}
                                onChange={(e) => setTotalTickets(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-col gap-4">

                        {/* PRICE */}
                        <div>
                            <Label>Base Price</Label>
                            <Input
                                type="number"
                                min={0}
                                value={basePrice}
                                onChange={(e) => setBasePrice(Number(e.target.value))}
                            />
                        </div>

                        {/* IMAGE UPLOAD */}
                        <div className="border p-3 rounded-md">
                            <Label>Concert Image</Label>
                            <p className="text-xs text-gray-500">Max 5MB</p>

                            <input type="file" accept="image/*" onChange={onImageChange} className="mt-2" />

                            {imagePreview && (
                                <div className="mt-4">
                                    <img src={imagePreview} className="h-40 w-full object-cover rounded-md border" />
                                    <Button variant="destructive" className="mt-2" onClick={removeImage}>
                                        Remove Image
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* DESCRIPTION */}
                        <div>
                            <Label>Description</Label>
                            <textarea
                                className="border p-2 rounded w-full resize-none"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        {/* PUBLISH */}
                        <div className="flex items-center justify-between mt-4">
                            <Label>Published (Visible to users)</Label>
                            <Switch checked={isPublished} onCheckedChange={setIsPublished} />
                        </div>
                    </div>
                </div>

            </div>
        </GenericDialog>
    );
}
