import { GenericTable } from "@/components/common/GenericTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Pencil, Trash2, CheckCircle2, XCircle } from "lucide-react";

export function TheaterTable({ theaters, isLoading, onEdit, onDelete }: any) {
    const columns = [
        { key: "name", label: "Name" },
        {
            key: "city",
            label: "City",
            render: (t: any) => t.city?.name || "-",
        },
        { key: "address", label: "Address" },
        {
            key: "facilities",
            label: "Facilities",
            render: (t: any) =>
                t.facilities?.length ? (
                    <div className="flex flex-wrap gap-1">
                        {t.facilities.map((f: string) => (
                            <Badge key={f} variant="secondary">
                                {f}
                            </Badge>
                        ))}
                    </div>
                ) : (
                    "-"
                ),
        },
        {
            key: "location",
            label: "Location",
            render: (t: any) =>
                t.location?.coordinates ? (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin size={14} />
                        {t.location.coordinates[1].toFixed(2)}, {t.location.coordinates[0].toFixed(2)}
                    </div>
                ) : (
                    "-"
                ),
        },
        {
            key: "isActive",
            label: "Status",
            render: (t: any) =>
                t.isActive ? (
                    <Badge variant="outline" className="text-green-600 border-green-300">
                        <CheckCircle2 size={14} className="mr-1" /> Active
                    </Badge>
                ) : (
                    <Badge variant="outline" className="text-red-600 border-red-300">
                        <XCircle size={14} className="mr-1" /> Inactive
                    </Badge>
                ),
        },
    ];

    return (
        <GenericTable
            data={theaters}
            columns={columns}
            isLoading={isLoading}
            actions={(t) => (
                <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={() => onEdit(t)}>
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => onDelete(t._id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            )}
        />
    );
}
