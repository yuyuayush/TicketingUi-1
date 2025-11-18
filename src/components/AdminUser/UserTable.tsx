"use client";

import React, { useMemo } from "react";
// Assuming GenericTable, Column type, Input, and Pagination control components are available
import { Pencil, Trash2, User, UserCheck, UserX, Phone, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input"; // Assuming a simple Input component
import { GenericTable, Column } from "@/components/common/GenericTable"; // Adjust path as necessary
import { IUser, IGetAllUsersParams } from "@/lib/types"; // Import necessary types

// ========================================================
// 1. Interface for Table Props (must match useAdminPage)
// ========================================================
interface UserTableProps {
    users: IUser[]; // Assuming IUser is the type of user object from the API
    isLoading: boolean;
    onEdit: (user: IUser) => void;
    onDelete: (id: string) => void;
    totalUsers: number;
    params: IGetAllUsersParams;
    setParams: React.Dispatch<React.SetStateAction<IGetAllUsersParams>>;
}


const colors = [
    "bg-red-400", "bg-green-400", "bg-blue-400",
    "bg-yellow-400", "bg-purple-400", "bg-pink-400",
    "bg-indigo-400", "bg-teal-400"
];

// Function to pick a consistent color for each user (optional)
const getAvatarColor = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
};



export function UserTable({
    users,
    isLoading,
    onEdit,
    onDelete,
    totalUsers,
    params,
    setParams
}: UserTableProps) {

    // Handler for search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setParams(prev => ({ ...prev, search: e.target.value, page: 1 })); // Reset to page 1 on new search
    };

    // Handler for pagination change (assuming GenericTable handles the actual total/limit logic)
    const handlePageChange = (newPage: number) => {
        setParams(prev => ({ ...prev, page: newPage }));
    };

    // Define columns using the Column type
    const columns: Column<IUser>[] = useMemo(() => [
        {
            key: 'name',
            label: 'User Details',
            render: (user) => {
                const bgColor = getAvatarColor(user._id);
                return (
                    <div className="flex items-center gap-3 font-medium" >
                        {/* Avatar */}
                        <div
                            className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-semibold ${bgColor}`}>
                            {user?.name?.charAt(0).toUpperCase()}
                        </div >
                        {/* Name & Email */}
                        <div className="flex flex-col" >
                            <p className="text-base text-gray-800">{user.name}</p>
                            <p className="text-sm text-muted-foreground italic">{user.email}</p>

                        </div >
                    </div >
                )
            }

        },
        {
            key: 'phone',
            label: 'Contact / ID',
            render: (user) => (
                <div className="flex flex-col text-sm text-gray-600">
                    <div className="flex items-center">
                        <Phone className="w-3 h-3 mr-1 text-blue-500" />
                        {user.phone || 'N/A'}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">ID: {user._id.slice(0, 8)}...</p>
                </div>
            )
        },
        {
            key: 'role',
            label: 'Role',
            render: (user) => {
                const isUser = user.role === 'user';
                return (
                    <Badge
                        variant={isUser ? "secondary" : "default"}
                        className={`capitalize font-semibold ${!isUser ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-gray-200 text-gray-700'}`}
                    >
                        <User className="w-3 h-3 mr-1" />
                        {user.role}
                    </Badge>
                );
            }
        },
    ], []);


    const renderActions = (user: IUser) => (
        <div className="flex gap-2 justify-end w-[120px] ml-auto">
            <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(user)}
                title="Edit User"
            >
                <Pencil className="w-4 h-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(user._id)}
                title="Delete User"
            >
                <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
        </div>
    );

    // Custom message for the empty state
    const emptyMessageContent = (
        <div className="text-center p-10 bg-gray-50 rounded-lg">
            <p className="text-xl font-medium text-gray-500">No users found.</p>
            <p className="text-sm text-gray-400 mt-1">Adjust your search or pagination settings.</p>
        </div>
    );

    return (
        <div className="space-y-4">
            {/* Search Input for filtering */}
            <div className="relative max-w-sm">
                <Input
                    placeholder="Search by name or email..."
                    value={params.search || ""}
                    onChange={handleSearchChange}
                    className="pl-8"
                />
                <Search className="w-4 h-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <GenericTable
                data={users}
                columns={columns}
                isLoading={isLoading}
                actions={renderActions}
                emptyMessage={emptyMessageContent as any}
                currentPage={params.page}
                pageSize={params.limit}
                totalItems={totalUsers}
                onPageChange={handlePageChange}
            />
        </div>
    );
}