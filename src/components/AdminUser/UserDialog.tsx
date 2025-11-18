"use client";

import React from "react";
// Assuming you have these common components and types
import { GenericDialog } from "@/components/common/GenericDialog";
import { Input, Switch } from "@/components/ui"; // Removed unused Button
import { IUser, IUserFormData, UserDialogProps } from "@/lib/types"; // Import IUser for type checking
import { ApiDropdown } from "@/components/ui/ApiDropdown"; // Re-used for Role selection

// ========================================================
// 1. Interface for Dialog Props (Updated Role Type)
// ========================================================



export function UserDialog({
    open,
    setOpen,
    formData,
    setFormData,
    editUser,
    handleSave,
    isPending,
}: UserDialogProps) {

    const availableRoles = [
        { name: 'Admin', value: 'ADMIN' },
        { name: 'User', value: 'USER' },
        { name: 'Theater Owner', value: 'THEATER_OWNER' }
    ];

    const setFormDataValue = (key: keyof IUserFormData, value: any) => {
        setFormData({ ...formData, [key]: value });
    };

    return (
        <GenericDialog
            open={open}
            setOpen={setOpen}
            title={editUser ? `Edit User: ${editUser.name}` : "Create New User"}
            onSave={() => handleSave()}
            isPending={isPending}

            saveButtonText={editUser ? "Update User" : "Create User"}
            className="max-w-3xl w-full"
        >
            {/* Scrollable Container */}
            <div className="max-h-[70vh] px-1 overflow-y-auto">
                <div className="grid grid-cols-1  gap-4">

                    {/* Column 1: Core User Details */}
                    <div className="flex flex-col gap-4">
                        <NameInput
                            value={formData.name}
                            setValue={(v) => setFormDataValue("name", v)}
                        />
                        <EmailInput
                            value={formData.email}
                            setValue={(v) => setFormDataValue("email", v)}
                            isEdit={!!editUser}
                        />
                        <PhoneInput
                            value={formData.phone || ""}
                            setValue={(v) => setFormDataValue("phone", v)}
                        />
                        <RoleDropdown
                            value={formData.role}
                            setValue={(v) => setFormDataValue("role", v as 'USER' | 'ADMIN' | 'THEATER_OWNER')}
                            roles={availableRoles as any} // Cast to simplify type passing
                        />
                    </div>

                    {/* Column 2: Status & Password */}
                    <div className="flex flex-col gap-4 pt-6 md:pt-0">
                        <ActiveSwitch
                            value={formData.isActive}
                            setValue={(v) => setFormDataValue("isActive", v)}
                        />

                    </div>
                </div>
            </div>
        </GenericDialog>
    );
}

// ========================================================
// 3. Subcomponents (Unchanged functionality)
// ========================================================

function NameInput({ value, setValue }: { value: string; setValue: (v: string) => void }) {
    return (
        <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Full Name</label>
            <Input className="" placeholder="User Full Name" value={value || ""} onChange={(e) => setValue(e.target.value)} />
        </div>
    );
}

function EmailInput({ value, setValue, isEdit }: { value: string; setValue: (v: string) => void; isEdit: boolean }) {
    return (
        <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Email</label>
            <Input
                placeholder="user@example.com"
                value={value || ""}
                onChange={(e) => setValue(e.target.value)}
                disabled={isEdit}
                className={isEdit ? "bg-gray-100 cursor-not-allowed" : ""}
            />
            {isEdit && <p className="text-xs text-gray-500">Email cannot be changed after creation.</p>}
        </div>
    );
}

function PhoneInput({ value, setValue }: { value: string; setValue: (v: string) => void }) {
    return (
        <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Phone Number</label>
            <Input
                placeholder="(123) 456-7890"
                value={value || ""}
                onChange={(e) => setValue(e.target.value)}
                type="tel"
            />
        </div>
    );
}

function RoleDropdown({
    value,
    setValue,
}: {
    value: 'USER' | 'ADMIN' | 'THEATER_OWNER';
    setValue: (v: 'USER' | 'ADMIN' | 'THEATER_OWNER') => void;
}) {
    return (
        <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">User Role</label>

            <select
                className="border rounded-lg px-3 py-2 bg-white"
                value={value}
                onChange={(e) =>
                    setValue(e.target.value as 'USER' | 'ADMIN' | 'THEATER_OWNER')
                }
            >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
                <option value="THEATER_OWNER">Theater Owner</option>
            </select>
        </div>
    );
}


function ActiveSwitch({ value, setValue }: { value: boolean; setValue: (v: boolean) => void }) {
    return (
        <div className="flex items-center justify-between pt-2">
            <label className="text-sm font-medium">Is Active (Login Allowed)</label>
            <Switch checked={value ?? true} onCheckedChange={setValue} />
        </div>
    );
}

