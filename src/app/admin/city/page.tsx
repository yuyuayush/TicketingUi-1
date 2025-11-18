"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";

// ✅ import your new hooks
import {
  useGetCities,
  useCreateCity,
  useUpdateCity,
  useDeleteCity,
} from "@/hooks/useCity";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/app/loading";

export default function CityAdminPage() {
  const { toast } = useToast();

  const { data: cities, isLoading } = useGetCities();
  const createCity = useCreateCity();
  const updateCity = useUpdateCity();
  const deleteCity = useDeleteCity();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCity, setEditCity] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    state: "",
    country: "India",
  });

  const handleSave = async () => {
    if (!formData.name || !formData.state) {
      toast({
        variant: "destructive",
        title: "Validation Error ⚠️",
        description: "City name and state are required.",
      });
      return;
    }

    if (editCity) {
      updateCity.mutate(
        { id: editCity._id, data: formData },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditCity(null);
            setFormData({ name: "", state: "", country: "India" });
          },
        }
      );
    } else {
      createCity.mutate(formData, {
        onSuccess: () => {
          setDialogOpen(false);
          setFormData({ name: "", state: "", country: "India" });
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this city?")) return;
    deleteCity.mutate(id);
  };

  const openEditModal = (city: any) => {
    setEditCity(city);
    setFormData({
      name: city.name,
      state: city.state,
      country: city.country || "India",
    });
    setDialogOpen(true);
  };

  const openAddModal = () => {
    setEditCity(null);
    setFormData({ name: "", state: "", country: "India" });
    setDialogOpen(true);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Manage Cities</h1>
        <Button onClick={openAddModal} className="flex items-center gap-2">
          <Plus size={18} /> Add City
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  Loading...
                </TableCell>
              </TableRow>
            ) : !cities || cities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No cities found
                </TableCell>
              </TableRow>
            ) : (
              cities.map((city) => (
                <TableRow key={city._id}>
                  <TableCell>{city.name}</TableCell>
                  <TableCell>{city.state}</TableCell>
                  <TableCell>{city.country}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        city.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {city.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditModal(city)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(city._id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editCity ? "Edit City" : "Add New City"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input
              placeholder="City Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              placeholder="State"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            />
            <Input
              placeholder="Country"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editCity ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
