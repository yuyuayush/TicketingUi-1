"use client";

import React, { useMemo } from "react";
import { Pencil, Trash2, Calendar, MapPin, CheckCircle2, XCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Column, GenericTable } from "../common/GenericTable";
import { ConcertTableProps, IConcertDisplay } from "@/lib/types";
import { formatDate } from "@/lib/utils";



export function ConcertTable({ concerts, isLoading, onEdit, onDelete, onView }: ConcertTableProps) {


    const columns: Column<IConcertDisplay>[] = useMemo(() => [
        {
            key: 'title',
            label: 'Title / Artist',
            render: (concert) => (
                <div className="font-medium">
                    <p className="text-base text-gray-800">{concert.title}</p>
                    <p className="text-sm text-muted-foreground italic">by {concert.artist}</p>
                    <Badge variant="secondary" className="mt-1">{concert.genre}</Badge>
                </div>
            )
        },
        {
            key: 'theaterId',
            label: 'Location',
            render: (concert) => {
                const theaterName = typeof concert?.theaterId === 'object' ? concert?.theaterId?.name : 'Unknown Theater';
                return (
                    <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-1 text-red-500" />
                        {theaterName}
                    </div>
                );
            }
        },
        {
            key: 'startTime',
            label: 'Time',
            render: (concert) => (
                <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-1 text-blue-500" />
                    {formatDate(concert.startTime as string)}
                </div>
            )
        },
        {
            key: 'basePrice',
            label: 'Price',
            className: 'font-semibold text-green-600',
            render: (concert) => `$${concert.basePrice.toFixed(2)}`
        },
        {
            key: 'isPublished',
            label: 'Status',
            className: 'text-center',
            render: (concert) => (
                <Badge
                    variant={concert.isPublished ? "default" : "destructive"}
                    className="flex items-center justify-center w-[80px] mx-auto"
                >
                    {concert.isPublished ? (
                        <>
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Live
                        </>
                    ) : (
                        <>
                            <XCircle className="w-3 h-3 mr-1" /> Draft
                        </>
                    )}
                </Badge>
            )
        },
    ], []);

    const renderActions = (concert: IConcertDisplay) => (
        <div className="flex gap-2 justify-end w-[180px] ml-auto">
            <Button
                variant="outline"
                size="icon"
                onClick={() => onView(concert)} // Open view modal
                title="View Details"
            >
                <Eye className="w-4 h-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(concert)}
                title="Edit Concert"
            >
                <Pencil className="w-4 h-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(concert._id)}
                title="Delete Concert"
            >
                <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
        </div>
    );


    // Custom message for the empty state
    const emptyMessageContent = (
        <div className="text-center p-10 bg-gray-50">
            <p className="text-xl font-medium text-gray-500">No concerts scheduled yet.</p>
            <p className="text-sm text-gray-400 mt-1">Click "Schedule Concert" to add your first event.</p>
        </div>
    );

    return (
        <GenericTable
            data={concerts}
            columns={columns}
            isLoading={isLoading}
            actions={renderActions}
            // Passing the custom component to emptyMessage, which GenericTable handles gracefully
            emptyMessage={emptyMessageContent as any}
        />
    );
}