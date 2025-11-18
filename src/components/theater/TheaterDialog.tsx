"use client";

import { useState } from "react";
import { GenericDialog } from "@/components/common/GenericDialog";
import { ApiDropdown } from "@/components/ui/ApiDropdown"; // Imported reusable dropdown
import { useGetCities } from "@/hooks/useCity";
import {
  Input,
  Button,
  Badge,
  Switch,
} from "@/components/ui";
// Removed unnecessary imports for Popover, Command components, cn, Check, and ChevronsUpDown

export function TheaterDialog({
  open,
  setOpen,
  formData,
  setFormData,
  editTheater,
  handleSave,
  isPending,
}: any) {
  // Fetch city data, now used directly by ApiDropdown
  const { data: cities = [], isLoading } = useGetCities();

  // Removed: const [cityPopoverOpen, setCityPopoverOpen] = useState(false);

  const handleFacilityChange = (value: string) => {
    setFormData((prev: any) => {
      const exists = prev.facilities.includes(value);
      return {
        ...prev,
        facilities: exists
          ? prev.facilities.filter((f: string) => f !== value)
          : [...prev.facilities, value],
      };
    });
  };

  return (
    <GenericDialog
      open={open}
      setOpen={setOpen}
      title={editTheater ? "Edit Theater" : "Add Theater"}
      onSave={handleSave}
      isPending={isPending}
    >
      {/* Theater Name */}
      <Input
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />

      {/* City Dropdown - Replaced with ApiDropdown */}
      <ApiDropdown
        label="City"
        placeholder="Select City"
        value={formData.city}
        onChange={(val) => setFormData({ ...formData, city: val })}
        data={cities}
        isLoading={isLoading}
        // Use getLabel to combine city name and state as done previously
        getLabel={(city: any) => `${city.name} — ${city.state}`}
        getValue={(city: any) => city._id}
      />

      {/* Address */}
      <Input
        placeholder="Address"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
      />

      {/* Facilities */}
      <div>
        <label className="text-sm font-medium">Facilities</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {["Parking", "Snacks", "Wheelchair Accessible", "AC Hall", "Online Booking"].map(
            (facility) => (
              <Badge
                key={facility}
                variant={
                  formData.facilities.includes(facility)
                    ? "default"
                    : "outline"
                }
                className="cursor-pointer select-none"
                onClick={() => handleFacilityChange(facility)}
              >
                {facility}
              </Badge>
            )
          )}
        </div>
      </div>

      {/* Coordinates */}
      <div className="flex gap-2">
        <Input
          placeholder="Latitude"
          type="number"
          value={formData.latitude}
          onChange={(e) =>
            setFormData({ ...formData, latitude: e.target.value })
          }
        />
        <Input
          placeholder="Longitude"
          type="number"
          value={formData.longitude}
          onChange={(e) =>
            setFormData({ ...formData, longitude: e.target.value })
          }
        />
      </div>

      {/* Status */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Active</label>
        <Switch
          checked={formData.isActive}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, isActive: checked })
          }
        />
      </div>
    </GenericDialog>
  );
}