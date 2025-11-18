"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { IUser, IGetAllUsersParams, IAdminUpdateUserData } from "@/lib/types";
import { useDeleteUser, useGetAllUsers, useUpdateUserByAdmin } from "@/hooks/useAdminAuth";
import { UserDialog } from "@/components/AdminUser/UserDialog";
import { UserTable } from "@/components/AdminUser/UserTable";
import { useUserStore } from "@/store/useUserAdminStore";
import Loading from "@/app/loading";

export default function UserAdminPage() {
    const [params, setParams] = useState<IGetAllUsersParams>({ page: 1, limit: 10, search: "" });

    const { data: userData, isLoading } = useGetAllUsers(params);
    const users: IUser[] = userData?.data?.users || [];
    const totalUsers: number = userData?.total || 0;

    const updateUserMutation = useUpdateUserByAdmin();
    const deleteUserMutation = useDeleteUser();
    const { toast } = useToast();

    // Zustand store
    const {
        formData,
        setFormData,
        editUser,
        isDialogOpen,
        openDialog,
        closeDialog,
    } = useUserStore();

    // Handlers
    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            deleteUserMutation.mutate(id);
        }
    };

    const handleSave = async () => {
        if (!formData.name || !formData.email) {
            toast({
                variant: "destructive",
                title: "Missing fields",
                description: "Name and Email are required.",
            });
            return;
        }

        const payload: IAdminUpdateUserData = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            isActive: formData.isActive,
        };

        if (editUser) {
            updateUserMutation.mutate({ userId: editUser._id, data: payload }, {
                onSuccess: () => closeDialog(),
            });
        }
    };

    const isPending = updateUserMutation.isPending || deleteUserMutation.isPending;

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-800">Manage Users 🧑‍💻</h1>
                <Button onClick={() => openDialog()} className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" /> Add User
                </Button>
            </div>

            <UserTable
                users={users}
                isLoading={isLoading}
                onEdit={openDialog}
                onDelete={handleDelete}
                totalUsers={totalUsers}
                params={params}
                setParams={setParams}
            />

            {isDialogOpen && (
                <UserDialog
                    open={isDialogOpen}
                    setOpen={closeDialog}
                    formData={formData}
                    setFormData={setFormData}
                    editUser={editUser}
                    handleSave={handleSave}
                    isPending={isPending}
                />
            )}
        </div>
    );
}
