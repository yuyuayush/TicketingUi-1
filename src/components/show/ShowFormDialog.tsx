"use client";

import React from "react";
import { GenericDialog } from "@/components/common/GenericDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiDropdown } from "@/components/ui/ApiDropdown";
import { useGetTheaters } from "@/hooks/useTheater";
import { useGetMovies } from "@/hooks/useMovie";

interface Pricing {
  gold: string;
  silver: string;
  platinum: string;
}

interface ShowFormDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  formData: any;
  setFormData: (data: any) => void;
  onSave: () => void;
  isPending?: boolean;
  editShow?: boolean;
}

export const ShowFormDialog: React.FC<ShowFormDialogProps> = ({
  open,
  setOpen,
  formData,
  setFormData,
  onSave,
  isPending = false,
  editShow = false,
}) => {
  // Fetch data when dialog opens
  const { data: theaters = [], isLoading: theatersLoading } = useGetTheaters();
  const { data: movies = [], isLoading: moviesLoading } = useGetMovies();

  return (
    <GenericDialog
      open={open}
      setOpen={setOpen}
      title={editShow ? "Edit Show" : "Add Show"}
      onSave={onSave}
      isPending={isPending}
    >
      <div className="space-y-4">
        {/* Movie Dropdown */}
        <ApiDropdown
          label="Movie"
          value={formData.movie}
          onChange={(val) => setFormData({ ...formData, movie: val })}
          data={movies}
          isLoading={moviesLoading}
          getLabel={(item) => item.title}
          getValue={(item) => item._id}
        />

        {/* Theater Dropdown */}
        <ApiDropdown
          label="Theater"
          value={formData.theater}
          onChange={(val) => setFormData({ ...formData, theater: val })}
          data={theaters}
          isLoading={theatersLoading}
          getLabel={(item) => item.name}
          getValue={(item) => item._id}
        />

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <Label htmlFor="show-date">Show Date</Label>
            <Input
              id="show-date"
              type="date"
              value={formData.showDate}
              onChange={(e) =>
                setFormData({ ...formData, showDate: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="show-time">Show Time</Label>
            <Input
              id="show-time"
              type="time"
              value={formData.showTime}
              onChange={(e) =>
                setFormData({ ...formData, showTime: e.target.value })
              }
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col">
            <Label htmlFor="gold-price">Gold Price</Label>
            <Input
              id="gold-price"
              type="number"
              value={formData.pricing.gold}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pricing: { ...formData.pricing, gold: e.target.value },
                })
              }
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="silver-price">Silver Price</Label>
            <Input
              id="silver-price"
              type="number"
              value={formData.pricing.silver}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pricing: { ...formData.pricing, silver: e.target.value },
                })
              }
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="platinum-price">Platinum Price</Label>
            <Input
              id="platinum-price"
              type="number"
              value={formData.pricing.platinum}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pricing: { ...formData.pricing, platinum: e.target.value },
                })
              }
            />
          </div>
        </div>

        {/* Seats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <Label htmlFor="total-seats">Total Seats</Label>
            <Input
              id="total-seats"
              type="number"
              value={formData.totalSeats}
              onChange={(e) =>
                setFormData({ ...formData, totalSeats: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="available-seats">Available Seats</Label>
            <Input
              id="available-seats"
              type="number"
              value={formData.availableSeats}
              onChange={(e) =>
                setFormData({ ...formData, availableSeats: e.target.value })
              }
            />
          </div>
        </div>
      </div>
    </GenericDialog>
  );
};
