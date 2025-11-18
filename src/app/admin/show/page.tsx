"use client";

import { useState } from "react";
import { Button, Badge, Input, Label } from "@/components/ui";
import { Plus } from "lucide-react";
import {
  useGetShows,
  useCreateShow,
  useUpdateShow,
  useDeleteShow,
} from "@/hooks/useShow";
import { GenericTable } from "@/components/common/GenericTable";
import { GenericDialog } from "@/components/common/GenericDialog";
import { ApiDropdown } from "@/components/ui/ApiDropdown";

// APIs for dropdowns
import { concertApi, theatersApi } from "@/lib/api";
import { useGetTheaters } from "@/hooks/useTheater";
import { ShowFormDialog } from "@/components/show/ShowFormDialog";
import Loading from "@/app/loading";

export default function ShowAdminPage() {
  const { data: shows = [], isLoading } = useGetShows();
  const createShow = useCreateShow();
  const updateShow = useUpdateShow();
  const deleteShow = useDeleteShow();

  const [open, setOpen] = useState(false);
  const [editShow, setEditShow] = useState<any>(null);

  const [formData, setFormData] = useState({
    movie: "",
    screen: "",
    theater: "",
    showDate: "",
    showTime: "",
    pricing: { gold: "", silver: "", platinum: "" },
    totalSeats: "",
    availableSeats: "",
    isActive: true,
  });

  // Reset form
  const resetForm = () =>
    setFormData({
      movie: "",
      screen: "",
      theater: "",
      showDate: "",
      showTime: "",
      pricing: { gold: "", silver: "", platinum: "" },
      totalSeats: "",
      availableSeats: "",
      isActive: true,
    });

  const handleAdd = () => {
    setEditShow(null);
    resetForm();
    setOpen(true);
  };

  const handleEdit = (show: any) => {
    setEditShow(show);
    setFormData({
      movie: show.movie?._id || "",
      screen: show.screen?._id || "",
      theater: show.theater?._id || "",
      showDate: show.showDate?.split("T")[0] || "",
      showTime: show.showTime || "",
      pricing: {
        gold: show.pricing?.gold || "",
        silver: show.pricing?.silver || "",
        platinum: show.pricing?.platinum || "",
      },
      totalSeats: show.totalSeats || "",
      availableSeats: show.availableSeats || "",
      isActive: show.isActive,
    });
    setOpen(true);
  };

  const handleDelete = (id: string) => deleteShow.mutate(id);

  const handleSave = () => {
    const payload = {
      movie: formData.movie,
      screen: formData.screen,
      theater: formData.theater,
      showDate: formData.showDate,
      showTime: formData.showTime,
      pricing: {
        gold: Number(formData.pricing.gold),
        silver: Number(formData.pricing.silver),
        platinum: Number(formData.pricing.platinum),
      },
      totalSeats: Number(formData.totalSeats),
      availableSeats: Number(formData.availableSeats),
      isActive: formData.isActive,
    };

    if (editShow) {
      updateShow.mutate(
        { id: editShow._id, data: payload },
        { onSuccess: () => setOpen(false) }
      );
    } else {
      createShow.mutate(payload, { onSuccess: () => setOpen(false) });
    }
  };

  // Table columns
  const columns = [
    { key: "movie.title", label: "Movie" },
    { key: "theater.name", label: "Theater" },
    { key: "screen.name", label: "Screen" },
    { key: "showDate", label: "Date" },
    { key: "showTime", label: "Time" },
    {
      key: "pricing",
      label: "Pricing",
      render: (row: any) =>
        `G: ₹${row.pricing?.gold} | S: ₹${row.pricing?.silver} | P: ₹${row.pricing?.platinum}`,
    },
    { key: "totalSeats", label: "Total Seats" },
    { key: "availableSeats", label: "Available Seats" },
    {
      key: "isActive",
      label: "Status",
      render: (row: any) =>
        row.isActive ? (
          <Badge variant="outline" className="text-green-600 border-green-300">
            Active
          </Badge>
        ) : (
          <Badge variant="outline" className="text-red-600 border-red-300">
            Inactive
          </Badge>
        ),
    },
  ];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage Shows</h1>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" /> Add Show
        </Button>
      </div>

      {/* Table */}
      <GenericTable
        data={shows}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No shows found"
        actions={(item) => (
          <div className="flex justify-end gap-2">
            <button
              onClick={() => handleEdit(item)}
              className="text-blue-600 hover:underline"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item._id!)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        )}
      />


      {/* Dialog Form */}
      {open && (
        <ShowFormDialog
          open={open}
          setOpen={setOpen}
          formData={formData}
          setFormData={setFormData}
          onSave={handleSave}
          isPending={createShow.isPending || updateShow.isPending}
          editShow={!!editShow}
        />
      )}
    </div>
  );
}
