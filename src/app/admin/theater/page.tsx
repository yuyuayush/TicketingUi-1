"use client";

import { useState } from "react";
import {
  useGetTheaters,
  useCreateTheater,
  useUpdateTheater,
  useDeleteTheater,
} from "@/hooks/useTheater";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useGetCities } from "@/hooks/useCity";
import { TheaterDialog } from "@/components/theater/TheaterDialog";
import { TheaterTable } from "@/components/theater/TheaterTable";
import Loading from "@/app/loading";

// ========================================================
//  Main Component
// ========================================================
export default function TheaterAdminPage() {
  const { data: theaters = [], isLoading } = useGetTheaters();
  const createTheater = useCreateTheater();
  const updateTheater = useUpdateTheater();
  const deleteTheater = useDeleteTheater();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [editTheater, setEditTheater] = useState<any>(null);
  const { formData, setFormData, resetForm } = useTheaterForm();

  //  Open Dialog for Add/Edit
  const handleOpenDialog = (theater?: any) => {
    if (theater) {
      setEditTheater(theater);
      setFormData({
        name: theater.name || "",
        city: theater.city || "",
        address: theater.address || "",
        facilities: theater.facilities || [],
        latitude: theater.location?.coordinates?.[1] || "",
        longitude: theater.location?.coordinates?.[0] || "",
        isActive: theater.isActive ?? true,
      });
    } else {
      setEditTheater(null);
      resetForm();
    }
    setOpen(true);
  };

  //  Delete
  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this theater?")) return;
    deleteTheater.mutate(id, {
      onSuccess: () => toast({ title: "Deleted successfully" }),
    });
  };

  // ✅ Save or Update Theater
  const handleSave = () => {
    if (!formData.name || !formData.city || !formData.address) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill all required fields.",
      });
      return;
    }

    const payload = {
      name: formData.name,
      city: formData.city,
      address: formData.address,
      facilities: formData.facilities,
      isActive: formData.isActive,
      location: {
        type: "Point",
        coordinates: [Number(formData.longitude), Number(formData.latitude)],
      },
    };

    if (editTheater) {
      updateTheater.mutate(
        { id: editTheater._id, data: payload },
        {
          onSuccess: () => {
            setOpen(false);
            setEditTheater(null);
            toast({ title: "Updated successfully" });
          },
        }
      );
    } else {
      createTheater.mutate(payload, {
        onSuccess: () => {
          setOpen(false);
          toast({ title: "Theater created successfully" });
        },
      });
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage Theaters</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" /> Add Theater
        </Button>
      </div>

      {/* 🎬 Subcomponent: Table */}
      <TheaterTable
        theaters={theaters}
        isLoading={isLoading}
        onEdit={handleOpenDialog}
        onDelete={handleDelete}
      />

      {/* 🪟 Subcomponent: Dialog */}
      <TheaterDialog
        open={open}
        setOpen={setOpen}
        formData={formData}
        setFormData={setFormData}
        editTheater={editTheater}
        handleSave={handleSave}
        isPending={createTheater.isPending || updateTheater.isPending}
      />
    </div>
  );
}

// ========================================================
// 🧱 Subcomponent: Theater Table
// ========================================================


// ========================================================
// 🪟 Subcomponent: Theater Dialog
// ========================================================


// ========================================================
//  Custom Hook: useTheaterForm
// ========================================================
function useTheaterForm() {
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
    facilities: [] as string[],
    latitude: "",
    longitude: "",
    isActive: true,
  });

  const resetForm = () =>
    setFormData({
      name: "",
      city: "",
      address: "",
      facilities: [],
      latitude: "",
      longitude: "",
      isActive: true,
    });

  return { formData, setFormData, resetForm };
}
